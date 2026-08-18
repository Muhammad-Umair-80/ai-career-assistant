const { GoogleGenAI } = require ( "@google/genai");
const { z } = require("zod");
const puppeteer = require("puppeteer");

const googleGenAiApiKey =
    process.env.GOOGLE_GENAI_API_KEY ||
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY;

if (!googleGenAiApiKey) {
    throw new Error('Missing Google GenAI API key. Set GOOGLE_GENAI_API_KEY (or GEMINI_API_KEY / GOOGLE_API_KEY).');
}

const client = new GoogleGenAI({ apiKey: googleGenAiApiKey });



const interviewGeneratedReportSchema = {
    type: "object",
    properties: {
        title: { type: "string", description: "The title of the interview report" },
        matchScore: { type: "number", description: "Overall feedback on the candidate's performance in the interview" },
        technicalQuestions: {
            type: "array",
            description: "A list of technical questions asked during the interview, along with their intentions and the candidate's answers",
            items: {
                type: "object",
                properties: {
                    question: { type: "string", description: "The technical question asked during the interview" },
                    intension: { type: "string", description: "The intention behind the technical question" },
                    answer: { type: "string", description: "The candidate's answer to the technical question" },
                },
                required: ["question", "intension", "answer"],
            },
        },
        behavioralQuestions: {
            type: "array",
            description: "A list of behavioral questions asked during the interview, along with their intentions and the candidate's answers",
            items: {
                type: "object",
                properties: {
                    question: { type: "string", description: "The behavioral question asked during the interview" },
                    intension: { type: "string", description: "The intention behind the behavioral question" },
                    answer: { type: "string", description: "The candidate's answer to the behavioral question" },
                },
                required: ["question", "intension", "answer"],
            },
        },
        skillGaps: {
            type: "array",
            description: "A list of skills that the candidate is lacking, along with the severity of each skill gap",
            items: {
                type: "object",
                properties: {
                    skill: { type: "string", description: "The skill that the candidate is lacking" },
                    severity: { type: "string", enum: ["medium", "high"], description: "The severity of the skill gap" },
                },
                required: ["skill", "severity"],
            },
        },
        preparation: {
            type: "array",
            description: "A list of preparation tasks for the candidate, organized by day, with a focus area and specific task for each day",
            items: {
                type: "object",
                properties: {
                    day: { type: "number", description: "The day of the preparation plan" },
                    focus: { type: "string", description: "The focus area for the preparation on that day" },
                    task: { type: "string", description: "The specific task to be completed on that day" },
                },
                required: ["day", "focus", "task"],
            },
        },
    },
    required: ["title", "matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparation"],
}

const interviewReportSchemaZod = z.fromJSONSchema(interviewGeneratedReportSchema);



/**
 * @name generateInterviewReport
 * @description: Generates an interview report based on the job description, resume description, and self-description provided by the user.
 * @param {string} jobDescription - The job description provided by the user.
 * @param {string} resumeDescription - The resume description provided by the user.
 * @param {string} selfDescription - The self-description provided by the user.
 * @returns {Promise<Object>} - A promise that resolves to the generated interview report.
 */
function normalizeInterviewInput(arg1, arg2, arg3) {
    // Support either (payloadObject) or (resumeDescription, jobDescription, selfDescription)
    if (typeof arg1 === 'object' && arg1 !== null) {
        const payload = arg1;
        return {
            resumeDescription: payload.resumeDescription || payload.resume_description || payload.resume || payload.resumeText,
            jobDescription: payload.jobDescription || payload.job_description || payload.jd || payload.job,
            selfDescription: payload.selfDescription || payload.self_description || payload.aboutMe || payload.self || payload.selfDesc,
        };
    }

    return {
        resumeDescription: arg1,
        jobDescription: arg2,
        selfDescription: arg3,
    };
}

async function generateInterviewReport(resumeDescription, jobDescription, selfDescription) {
    const normalizedInput = normalizeInterviewInput(resumeDescription, jobDescription, selfDescription);
    const { resumeDescription: finalResumeDescription, jobDescription: finalJobDescription, selfDescription: finalSelfDescription } = normalizedInput;

    const missingFields = [];
    if (!finalResumeDescription) missingFields.push('resumeDescription');
    if (!finalJobDescription) missingFields.push('jobDescription');

    if (missingFields.length > 0) {
        throw new Error(`Missing required input(s): ${missingFields.join(', ')}`);
    }


    // const recipeSchema = z.fromJSONSchema(recipeJsonSchema);

    const prompt = `generate an interview report based on the following information:
                    resume Description: ${finalResumeDescription}
                    job Description: ${finalJobDescription}
                    Self Description: ${finalSelfDescription}
                `;

    
    console.log('Calling Google AI generateContent...');
    const response = await client.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: interviewGeneratedReportSchema,

        },
    });
    console.log('Received response from Google AI.');

    const reportText = response.text;
    let interviewReport;
    try {
        interviewReport = interviewReportSchemaZod.parse(JSON.parse(reportText));
    } catch (err) {
        console.error('Schema validation failed for interview report:', err);
        // Try to parse loosely to preserve as much as possible
        try {
            interviewReport = JSON.parse(reportText);
        } catch (err2) {
            throw new Error('Failed to parse interview report JSON: ' + err2.message);
        }
    }

    // If the model omitted the preparation plan, request a focused preparation plan and attach it
    if (!interviewReport.preparation || !Array.isArray(interviewReport.preparation) || interviewReport.preparation.length === 0) {
        console.log('Preparation plan missing from model response — requesting focused preparation plan.');
        const prepSchema = {
            type: "array",
            items: {
                type: "object",
                properties: {
                    day: { type: "number" },
                    focus: { type: "string" },
                    task: { type: "string" }
                },
                required: ["day", "focus", "task"]
            }
        };

        const prepPrompt = `Based on the following interview analysis, generate a preparation plan organized by day. Provide an array of objects with "day" (number), "focus" (short string), and "task" (detailed string).\n\nInterview analysis:\n${JSON.stringify(interviewReport, null, 2)}\n\nReturn only JSON matching the schema.`;

        try {
            const prepResp = await client.models.generateContent({
                model: "gemini-3.5-flash-lite",
                contents: prepPrompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: prepSchema,
                },
            });
            const prepText = prepResp.text;
            try {
                const prepArray = JSON.parse(prepText);
                if (Array.isArray(prepArray)) {
                    interviewReport.preparation = prepArray;
                } else {
                    console.warn('Preparation response was not an array; ignoring.');
                }
            } catch (parseErr) {
                console.warn('Failed to parse preparation response JSON:', parseErr);
            }
        } catch (prepErr) {
            console.error('Error requesting preparation plan:', prepErr);
        }
    }

    // Normalize field names to match the Mongoose model
    // Model expects `preparations` (plural). Accept many variants from the AI and normalize.
    try {
        // Map singular `preparation` -> `preparations`
        if (interviewReport.preparation && !interviewReport.preparations) {
            interviewReport.preparations = interviewReport.preparation;
            delete interviewReport.preparation;
        }

        // Common alternative names
        const altNames = ['preparationPlan', 'preparation_plan', 'preparationsPlan', 'preparationList'];
        for (const name of altNames) {
            if (interviewReport[name] && !interviewReport.preparations) {
                interviewReport.preparations = interviewReport[name];
                delete interviewReport[name];
                break;
            }
        }

        // If still missing, try to find a top-level candidate that looks like the preparation array
        if (!Array.isArray(interviewReport.preparations) || interviewReport.preparations.length === 0) {
            for (const k of Object.keys(interviewReport)) {
                const val = interviewReport[k];
                if (Array.isArray(val) && val.length > 0 && typeof val[0] === 'object') {
                    const sample = val[0];
                    const hasDay = Object.prototype.hasOwnProperty.call(sample, 'day');
                    const hasFocus = Object.prototype.hasOwnProperty.call(sample, 'focus');
                    const hasTask = Object.prototype.hasOwnProperty.call(sample, 'task');
                    if (hasDay && hasFocus && hasTask) {
                        interviewReport.preparations = val;
                        // remove the original key to avoid accidental mapping into other model fields
                        if (k !== 'preparations') delete interviewReport[k];
                        break;
                    }
                }
            }
        }

        // Ensure preparations is an array (at minimum empty array expected by model)
        if (!Array.isArray(interviewReport.preparations)) {
            interviewReport.preparations = Array.isArray(interviewReport.preparations) ? interviewReport.preparations : [];
        }

        // Defensive: prevent the AI from injecting top-level DB fields like _id or user objects
        if (interviewReport._id) delete interviewReport._id;
        if (interviewReport.user && (typeof interviewReport.user === 'object' || Array.isArray(interviewReport.user))) {
            // If user is not a MongoDB ObjectId string, remove it to avoid overwriting relationships.
            delete interviewReport.user;
        }
    } catch (normErr) {
        console.warn('Error normalizing interview report fields:', normErr);
    }

    return interviewReport;
}


async function generatePdfFromHtml(htmlContent){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({ format: 'A4' });

    await browser.close();

    return pdfBuffer
}

async function generateResumePdf({resume , selfDescription , jobDescription}){
    const resumePdfSchema = {
        type: "object",
        properties: {
            resume: { type: "string", description: "The Html content of the resume which can be converted to PDF using any library like puppeteer " },
    }}

    const prompt = `generate a resume in HTML format based on the following information:
                    Resume: ${resume}
                    self Description: ${selfDescription}
                    job Description : ${jobDescription}

                    the response should be a JSON object with a single field "html" which contain the HTML content of the resume which can be converted to PDF usinf any library like puppeteer
                    `

    const response = await client.models.generateContent({

        model: "gemini-3.5-flash-lite",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema:  resumePdfSchema,

        },
    
    })
    const jsonContent = JSON.parse(response.text);
    const pdfBuffer = await generatePdfFromHtml(jsonContent.resume);
    return pdfBuffer;

}


module.exports = {
    generateInterviewReport,
    interviewGeneratedReportSchema,
    interviewReportSchemaZod,
    generateResumePdf
};


