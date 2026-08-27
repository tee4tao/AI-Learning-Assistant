// import fs from 'fs/promises';
// import { PDFParse } from 'pdf-parse';


// /**
//  * Extract text from PDF file
//  * @param {string} filePath - Path to the PDF file
//  * @returns {Promise<string>} - Extracted text from the PDF
//  */
// export const extractTextFromPDF = async (filePath) => {
//     try {
//         const dataBuffer = await fs.readFile(filePath);
//         // pdf-parse expects a Unit8Array, not a Buffer
//         const parser = new PDFParse(new Uint8Array(dataBuffer));
//         const data = await parser.getText();
//         // const pdfData = await PDFParse(dataBuffer);
//         return {
//             text: data.text,
//             numPages: data.numpages,
//             info: data.info
//         };
//     } catch (error) {
//         console.error(`Error parsing PDF: ${error.message}`);
//         throw new Error("Failed to extract text from PDF");
//     }
// };

// import fs from 'fs/promises';

// /**
//  * Extract text from PDF file
//  * @param {string} filePath - Path to the PDF file
//  * @returns {Promise<string>} - Extracted text from the PDF
//  */
// export const extractTextFromPDF = async (filePath) => {
//     try {
//         const { PDFParse } = await import('pdf-parse');

//         const dataBuffer = await fs.readFile(filePath);
//         // pdf-parse expects a Uint8Array, not a Buffer
//         const parser = new PDFParse(new Uint8Array(dataBuffer));
//         const data = await parser.getText();

//         return {
//             text: data.text,
//             numPages: data.numpages,
//             info: data.info
//         };
//     } catch (error) {
//         console.error(`Error parsing PDF: ${error.message}`);
//         throw new Error("Failed to extract text from PDF");
//     }
// };




// Minimal polyfills so pdfjs-dist (used internally by pdf-parse) doesn't crash
// in Node.js — we only need text extraction, not rendering, so these can be
// no-op stand-ins.
// if (typeof globalThis.DOMMatrix === 'undefined') {
//     globalThis.DOMMatrix = class DOMMatrix {
//         constructor() {}
//     };
// }
// if (typeof globalThis.Path2D === 'undefined') {
//     globalThis.Path2D = class Path2D {
//         constructor() {}
//     };
// }
// if (typeof globalThis.ImageData === 'undefined') {
//     globalThis.ImageData = class ImageData {
//         constructor() {}
//     };
// }

// export const extractTextFromPDF = async (fileBuffer) => {
//     try {
//         const { PDFParse } = await import('pdf-parse');

//         // fileBuffer is already a Buffer from multer memoryStorage — just wrap it
//         const parser = new PDFParse(new Uint8Array(fileBuffer));
//         const data = await parser.getText();

//         return {
//             text: data.text,
//             numPages: data.numpages,
//             info: data.info
//         };
//     } catch (error) {
//         console.error(`Error parsing PDF: ${error.message}`);
//         throw new Error("Failed to extract text from PDF");
//     }
// };

import { extractText, getDocumentProxy } from 'unpdf';

/**
 * Extract text from PDF file
 * @param {Buffer|Uint8Array} fileBuffer - PDF file contents in memory
 * @returns {Promise<{text: string, numPages: number, info: object}>}
 */
export const extractTextFromPDF = async (fileBuffer) => {
    try {
        const data = fileBuffer instanceof Uint8Array
            ? fileBuffer
            : new Uint8Array(fileBuffer);

        // Load the PDF into unpdf's serverless PDF.js build (no worker, no DOM needed)
        const pdf = await getDocumentProxy(data);

        // Extract and merge text across all pages into a single string
        const { text, totalPages } = await extractText(pdf, { mergePages: true });

        // Pull document metadata (title, author, etc.) via the underlying PDF.js proxy
        const { info } = await pdf.getMetadata();

        return {
            text,
            numPages: totalPages,
            info
        };
    } catch (error) {
        console.error(`Error parsing PDF: ${error.message}`);
        throw new Error("Failed to extract text from PDF");
    }
};