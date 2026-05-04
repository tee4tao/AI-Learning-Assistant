// @desc    Generate flashcards from document
// @route   POST /api/v1/ai/generate-flashcards

import Document from "../models/document.model.js";
import Flashcard from "../models/flashcard.model.js";
import { generateFlashcards } from "../utils/geminiService.js";

// @access  Private
export const generateFlashcard = async (req, res, next) => {
  try {
    const {documentId, count = 10} = req.body;

    if (!documentId) {
      return res.status(400).json({ error: 'Document ID is required' });
    }

    const document = await Document.findOne({ _id: documentId, userId: req.user._id, status: 'ready' });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Generate flashcards using Gemini
    const cards = await generateFlashcards(document.extractedText, parseInt(count));
    
    // Save to DB
    const flashcardSet = await Flashcard.create({
      userId: req.user._id,
      documentId: document._id,
      cards: cards.map(card => ({
        question: card.question,
        answer: card.answer,
        difficulty: card.difficulty,
        reviewCount: 0,
        isStarred: false
      }))
    })

    res.status(201).json({
      success: true,
      data: flashcardSet,
      message: 'Flashcards generated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate quiz from document
// @route   POST /api/v1/ai/generate-quiz
// @access  Private
export const generateQuiz = async (req, res, next) => {
  try {
    
  } catch (error) {
    next(error);
  }
};

// @desc    Generate summary from document
// @route   POST /api/v1/ai/generate-summary
// @access  Private
export const generateSummary = async (req, res, next) => {
  try {
    
  } catch (error) {
    next(error);
  }
};

// @desc    Chat with document
// @route   POST /api/v1/ai/chat
// @access  Private
export const chat = async (req, res, next) => {
  try {
    
  } catch (error) {
    next(error);
  }
};

// @desc    Explain concept from document
// @route   POST /api/v1/ai/explain-concept
// @access  Private
export const explainConcept = async (req, res, next) => {
  try {
    
  } catch (error) {
    next(error);
  }
};

// @desc    Get chat history for a document
// @route   GET /api/v1/ai/chat-history/:documentId
// @access  Private
export const getChatHistory = async (req, res, next) => {
  try {
    
  } catch (error) {
    next(error);
  }
};
