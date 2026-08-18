const mongoose = require ('mongoose');

/**
 * 
 * job description: string
 * resume description: string
 * self description: string
 * 
 * matchScore: number
 * technical question :[{question: string, intension : string, answer: string, }]
 * behavioral question :[{question: string, intension : string, answer: string, }]
 * skill gap :[{skill: string, severity{meduim , high}}]
 * preparation :[{day:number , focus: string, task: string}]
 * 
 */

const technicalQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    intension: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    }
},{
    _id: false
}
);

const behavioralQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    intension: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    }
},{
    _id: false
}
);

const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: true,
    },
    severity: {
        type: String,
        enum: ['medium', 'high'],
        required: true,
    },
},{
    _id: false
}
);

const preparationSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: true,
    },
    focus: {
        type: String,
        required: true,
    },
    task: {
        type: String,
        required: true,
    }
},{
    _id: false
}
);


const interviewReportSchema = new mongoose.Schema({
    resumeDescription: {
        type: String,
        required: true,
    },
    jobDescription: {
        type: String,
        required: true,
    },
    selfDescription: {
        type: String,
        required: true,
    },
    matchScore: {
        type: Number,
        required: true,
    },
    technicalQuestions: [technicalQuestionSchema],
    behavioralQuestions: [behavioralQuestionSchema],
    skillGaps: [skillGapSchema],
    preparations: [preparationSchema],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
    }
}, { timestamps: true });

const InterviewReportModel = mongoose.model('InterviewReport', interviewReportSchema);

module.exports = InterviewReportModel;
