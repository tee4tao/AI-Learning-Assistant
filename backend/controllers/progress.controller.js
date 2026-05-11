// @desc    Get user learning statistics
// @route   Get /api/v1/progress/dashboard
// @access  Private

import Document from "../models/document.model.js";
import Flashcard from "../models/flashcard.model.js";
import Quiz from "../models/quiz.model.js";

export const getDashboard = async (req, res, next) => {
    try {
        const userId = req.user._id;

        // Get counts
        const totalDocuments = await Document.countDocuments({ userId });
        const totalFlashcardSets = await Flashcard.countDocuments({ userId });
        const totalQuizzes = await Quiz.countDocuments({ userId });
        const completedQuizzes = await Quiz.countDocuments({ userId, completedAt: {$ne: null} });

        // Get flashcard statistics
        const flashcardSets = await Flashcard.find({ userId });
        let totalFlashcards = 0;
        let reviewedFlashcards = 0;
        let starredFlashcards = 0;

        flashcardSets.forEach((set) => {
            totalFlashcards += set.cards.length;
            reviewedFlashcards += set.cards.filter((fc) => fc.reviewCount > 0).length;
            starredFlashcards += set.cards.filter((fc) => fc.isStarred).length;
        });

        // Get quiz statistics
        const quizzes = await Quiz.find({ userId, completedAt: { $ne: null } });
        const averageScore = quizzes.length > 0 ? Math.round(quizzes.reduce((sum, quiz) => sum + quiz.score, 0) / quizzes.length) : 0;

        // Recent activity
        const recentDocuments = await Document.find({ userId }).sort({ createdAt: -1 }).limit(5).select('title fileName lastAccessed status');

        const recentQuizzes = await Quiz.find({ userId }).sort({ createdAt: -1 }).limit(5).populate('documentId', 'title').select('title score totalQuestions completedAt');

        // Study streak (simplified- in production, track daily activity)
        const studyStreak = Math.floor(Math.random() * 7) + 1; // Mock data

        // Send response
        res.status(200).json({
            success: true,
            data:{
                overview: {
                    totalDocuments,
                    totalFlashcardSets,
                    totalQuizzes,
                    completedQuizzes,
                    totalFlashcards,
                    reviewedFlashcards,
                    starredFlashcards,
                    averageScore,
                    studyStreak
                },
                recentActivity:{
                    documents: recentDocuments,
                    quizzes: recentQuizzes
                }
            }
        });
    } catch (error) {
        next(error);
    }
}