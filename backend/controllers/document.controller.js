// @desc    Upload PDF document
// @route   POST /api/v1/documents/upload

import { PORT } from "../config/env.js";
import Document from "../models/document.model.js";
import { extractTextFromPDF } from "../utils/pdfParser.js";
import { chunkText } from "../utils/textChunker.js";
import fs from 'fs/promises';

// @access  Private
export const uploadDocument = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'Please upload a PDF file' });
        }

        const {title} = req.body;

        if (!title) {
            // Delete the uploaded file
            await fs.unlink(req.file.path);
            return res.status(400).json({ success: false, error: 'Document title is required' });
        }

        // construct the url for the uploaded file
        const baseUrl = `http://localhost:${PORT || 8000}`;
        const fileURl = `${baseUrl}/uploads/documents/${req.file.filename}`;

        // Create document record in the database
        const document = await Document.create({
            userId: req.user._id,
            title,
            fileName: req.file.originalname,
            filePath: fileURl, // Store the URL instead of the local path
            fileSize: req.file.size,
            status: 'processing'
        })

        // Process PDF in background (in production, use a task queue like BullMQ)
        processPDF(document._id, req.file.path).catch((error) => {
            console.error('Error processing PDF:', error);
        });

        res.status(201).json({ success: true, data: document, message: 'Document uploaded successfully. Processing in progress...' });
    } catch (error) {
        if (req.file) {
            await fs.unlink(req.file.path).catch(()=> {});
        }
        next(error);
    }
}

const processPDF = async (documentId, filePath) => {
    try {
        const {text} = await extractTextFromPDF(filePath);
    
        const chunks = chunkText(text, 500, 50);
    
        // Update document
        await Document.findByIdAndUpdate(documentId, {
            extractedText: text,
            chunks,
            status: 'ready'
        })
    
        console.log(`Document ${documentId} processed successfully`);
    } catch (error) {
        console.error(`Error processing document ${documentId}:`, error);

        await Document.findByIdAndUpdate(documentId, {
            status: 'failed'
        });
    }
}

// @desc    Get all user documents
// @route   GET /api/v1/documents
// @access  Private
export const getDocuments = async (req, res, next) => {
    try {
        // const documents = await Document.find({ userId: req.user._id });

        // if (!documents || documents.length === 0) {
        //     return res.status(404).json({ success: false, error: 'No documents found' });
        // }
        // res.status(200).json({ success: true, data: documents });
        const documents = await Document.aggregate([
            {
                $match: {userId: new mongoose.Types.ObjectId(req.user._id)}
            },
            {
                $lookup: {
                    from: 'flashcards',
                    localField: '_id',
                    foreignField: 'documentId',
                    as: 'flashcardSets'

                }
            },
            {
                $lookup: {
                    from: 'quizzes',
                    localField: '_id',
                    foreignField: 'documentId',
                    as: 'quizzes'
                }
            },{
                $addFields: {
                    flashcardCount: {$size: '$flashcardSets'},
                    quizCount: {$size: '$quizzes'}
                }
            },
            {
                $project: {
                    extractedText: 0,
                    chunks: 0,
                    flashcardSets: 0,
                    quizzes: 0
                }
            },
            {
                $sort: { uploadDate: -1 }
            }
        ]);

        res.status(200).json({ success: true, count: documents.length, data: documents });
    } catch (error) {
        next(error);
    }
}

// @desc    Get a single document with chunks
// @route   GET /api/v1/documents/:id
// @access  Private
export const getDocument = async (req, res, next) => {
    try {
        
    } catch (error) {
        next(error);
    }
}

// @desc    Delete a document
// @route   DELETE /api/v1/documents/:id
// @access  Private
export const deleteDocument = async (req, res, next) => {
    try {
        
    } catch (error) {
        next(error);
    }
}

// @desc    Update document title
// @route   PUT /api/v1/documents/:id
// @access  Private
export const updateDocument = async (req, res, next) => {
    try {
        
    } catch (error) {
        next(error);
    }
}