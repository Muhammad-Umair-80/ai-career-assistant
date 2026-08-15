// Robust PDF text extractor wrapper
// Tries multiple libraries/shapes so it works across different pdf-parse versions.

async function tryPdfParseWithPackage(buffer) {
  // Try several pdf-parse entry points to support different package builds
  try {
    // 1) Standard require('pdf-parse') - some versions export a function
    let m;
    try {
      m = require('pdf-parse');
    } catch (e) {
      m = null;
    }

    if (m) {
      if (typeof m === 'function') {
        try {
          const data = await m(buffer);
          return data && data.text ? data.text : null;
        } catch (e) {
          console.warn('pdf-parse(function) approach failed:', e && e.message ? e.message : e);
        }
      }

      if (m && typeof m.PDFParse === 'function') {
        try {
          const PDFParse = m.PDFParse;
          const parser = new PDFParse();
          if (typeof parser.parseBuffer === 'function') {
            const data = await parser.parseBuffer(buffer);
            return data && data.text ? data.text : null;
          }
        } catch (e) {
          console.warn('pdf-parse (class) approach failed:', e && e.message ? e.message : e);
        }
      }
    }

    // 2) Try the packaged cjs node build path (pdf-parse/dist/pdf-parse/cjs/index.cjs)
    try {
      const m2 = require('pdf-parse/dist/pdf-parse/cjs/index.cjs');
      if (m2) {
        if (typeof m2 === 'function') {
          try {
            const data = await m2(buffer);
            return data && data.text ? data.text : null;
          } catch (e) {
            console.warn('pdf-parse cjs(function) approach failed:', e && e.message ? e.message : e);
          }
        }
        if (m2 && typeof m2.PDFParse === 'function') {
          try {
            const PDFParse = m2.PDFParse;
            const parser = new PDFParse();
            if (typeof parser.parseBuffer === 'function') {
              const data = await parser.parseBuffer(buffer);
              return data && data.text ? data.text : null;
            }
          } catch (e) {
            console.warn('pdf-parse cjs(class) approach failed:', e && e.message ? e.message : e);
          }
        }
      }
    } catch (e) {
      // ignore
    }
  } catch (err) {
    // ignore outer errors
  }
  return null;
}

async function tryPdfJsFallback(buffer) {
  try {
    // Some pdfjs-dist builds are ESM; import dynamically and provide minimal DOM polyfills
    if (typeof globalThis.DOMMatrix === 'undefined') {
      globalThis.DOMMatrix = class {};
    }
    const pdfjsLib = await import('pdfjs-dist/build/pdf.mjs');
    const uint8 = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
    const loadingTask = pdfjsLib.getDocument({ data: uint8 });
    const doc = await loadingTask.promise;
    let fullText = '';
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }
    return fullText.trim() || null;
  } catch (err) {
    // pdfjs-dist not available or parsing failed
    console.warn('pdfjs-dist fallback failed:', err && err.message ? err.message : err);
    return null;
  }
}

async function parsePDF(buffer) {
  if (!buffer) return null;

  // 1) Try pdf-parse package in its common function export form or class form
  const fromPdfParse = await tryPdfParseWithPackage(buffer);
  if (fromPdfParse) return fromPdfParse;

  // 2) Fallback to pdfjs-dist
  const fromPdfJs = await tryPdfJsFallback(buffer);
  if (fromPdfJs) return fromPdfJs;

  // 3) No method succeeded
  return null;
}

module.exports = { parsePDF };