// @desc    Generate flashcards from document
// @route   POST /api/v1/ai/generate-flashcards

import ChatHistory from "../models/chatHistory.model.js";
import Document from "../models/document.model.js";
import Flashcard from "../models/flashcard.model.js";
import Quiz from "../models/quiz.model.js";
import { chatWithDocumentContext, generateDocumentSummary, generateFlashcards, generateQuizQuestions, explainConcept } from "../utils/geminiService.js";
import { findRelevantChunks } from "../utils/textChunker.js";

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
        const {documentId, numQuestions = 5, title} = req.body;

    if (!documentId) {
      return res.status(400).json({ error: 'Document ID is required' });
    }

    const document = await Document.findOne({ _id: documentId, userId: req.user._id, status: 'ready' });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Generate quiz using Gemini
    const questions = await generateQuizQuestions(document.extractedText, parseInt(numQuestions));

    // Save quiz to DB
    const quiz = await Quiz.create({
      userId: req.user._id,
      documentId: document._id,
      title: title || `${document.title} - Quiz`,
      questions: questions,
      totalQuestions: questions.length,
      userAnswers: [],
      score: 0
    });

    res.status(201).json({
      success: true,
      data: quiz,
      message: 'Quiz generated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate summary from document
// @route   POST /api/v1/ai/generate-summary
// @access  Private
export const generateSummary = async (req, res, next) => {
  try {
    const {documentId} = req.body;
    if (!documentId) {
      return res.status(400).json({ error: 'Document ID is required' });
    }

    const document = await Document.findOne({ _id: documentId, userId: req.user._id, status: 'ready' });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Generate summary using Gemini
    const summary = await generateDocumentSummary(document.extractedText);

    res.status(200).json({
      success: true,
      data: {
        documentId: document._id,
        title: document.title,
        summary
      },
      message: 'Summary generated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Chat with document
// @route   POST /api/v1/ai/chat
// @access  Private
export const chat = async (req, res, next) => {
  try {
    const {documentId, question} = req.body;

    if (!documentId || !question) {
      return res.status(400).json({ error: 'Document ID and question are required' });
    }

    const document = await Document.findOne({ _id: documentId, userId: req.user._id, status: 'ready' });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Find revelant chunks
    const relevantChunks = findRelevantChunks(document.chunks, question, 3);
    const chunkIndices = relevantChunks.map(c => c.chunkIndex);

    // Get or create chat History
    let chatHistory = await ChatHistory.findOne({ documentId, userId: req.user._id });

    if (!chatHistory) {
      chatHistory = await ChatHistory.create({ documentId, userId: req.user._id, messages: [] });
    }

    // Generate chat response using Gemini
    const response = await chatWithDocumentContext(question, relevantChunks);

    // Save message to chat history
    chatHistory.messages.push(
      {
        role: 'user',
        content: question,
        timestamp: new Date(),
        relevantChunks: []
      },
      {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        relevantChunks: chunkIndices
      }
    );
    await chatHistory.save();

    res.status(200).json({
      success: true,
      data: {
        question,
        response,
        relevantChunks: chunkIndices,
        chatHistoryId: chatHistory._id
      },
      message: 'Chat response generated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Explain concept from document
// @route   POST /api/v1/ai/explain-concept
// @access  Private
export const explainTheConcept = async (req, res, next) => {
  try {
    const {documentId, concept} = req.body;
    if (!documentId || !concept) {
      return res.status(400).json({ error: 'Document ID and concept are required' });
    }

    const document = await Document.findOne({ _id: documentId, userId: req.user._id, status: 'ready' });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

        // Find revelant chunks for the concept
    const relevantChunks = findRelevantChunks(document.chunks, concept, 3);
    const context = relevantChunks.map(c => c.content).join('\n\n');

    // Generate explanation using Gemini
    const explanation = await explainConcept(concept, context);

    res.status(200).json({
      success: true,
      data: {
        concept,
        explanation,
        relevantChunks: relevantChunks.map(c => c.chunkIndex)
      },
      message: 'Explanation generated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get chat history for a document
// @route   GET /api/v1/ai/chat-history/:documentId
// @access  Private
export const getChatHistory = async (req, res, next) => {
  try {
    const { documentId } = req.params;

    if (!documentId) {
      return res.status(400).json({ error: 'Document ID is required' });
    }

    const chatHistory = await ChatHistory.findOne({ documentId, userId: req.user._id }).select('messages'); // Only retrive the message array;

    if (!chatHistory) {
      return res.status(200).json({
        success: true,
        data: [], //Return an empty array if no chat history found
        message: 'No chat history found'
      });
    }

    res.status(200).json({
      success: true,
      data: chatHistory.messages,
      message: 'Chat history retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};
