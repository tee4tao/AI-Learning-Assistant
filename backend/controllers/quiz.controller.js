import Quiz from "../models/quiz.model.js"

// @desc    Get all quizzes for a document
// @route   Get /api/v1/quizzes/:documentId
// @access  Private
export const getQuizzes = async (req, res, next) => {
    try {
        const quizzes = await Quiz.find({userId:req.user._id, documentId: req.params.documentId }).populate('documentId', 'title fileName').sort({ createdAt: -1 })

        if (!quizzes) {
            return res.status(404).json({ message: "No quizzes found" })
        }

        res.status(200).json({
            success: true,
            count: quizzes.length,
            data: quizzes,
        })
    } catch (error) {
        next(error)
    }
}

// @desc    Get a single quiz by ID
// @route   Get /api/v1/quizzes/quiz/:id
// @access  Private
export const getQuizById = async (req, res, next) => {
    try {
        const quiz = await Quiz.findOne(
            { _id: req.params.id, userId: req.user._id }
        )

        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" })
        }

        res.status(200).json({
            success: true,
            data: quiz,
        })
    } catch (error) {
        next(error)
    }
}

// @desc    Submit quiz answers
// @route   POST /api/v1/quizzes/:id/submit
// @access  Private
export const submitQuiz = async (req, res, next) => {
    try {
        const { answers } = req.body

        if (!Array.isArray(answers)) {
            return res.status(400).json({ message: "Answers must be an array" })
        }

        const quiz = await Quiz.findOne({ _id: req.params.id, userId: req.user._id })

        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" })
        }

        if (quiz.completedAt) {
            return res.status(400).json({ message: "Quiz already completed" })
        }

        // Process answers
        const userAnswers = [];
        let correctCount = 0;

        answers.forEach((answer)=>{
            const {questionIndex, selectedAnswer} = answer
            if (questionIndex < quiz.questions.length) {
                const question = quiz.questions[questionIndex]

                const isCorrect = selectedAnswer === question.correctAnswer;

                if (isCorrect) {
                    correctCount++;
                }

                userAnswers.push({
                    questionIndex,
                    selectedAnswer,
                    isCorrect,
                    answeredAt: new Date(),
                })
            }
        })

        const score = Math.round((correctCount / quiz.questions.length) * 100);

        // update quiz
        quiz.userAnswers = userAnswers;
        quiz.score = score;
        quiz.completedAt = new Date();
        await quiz.save();

        res.status(200).json({
            success: true,
            data: {
                quizId: quiz._id,
                score,
                correctCount,
                totalQuestions: quiz.questions.length,
                percentage: score,
                userAnswers
            },
            message: 'Quiz submitted successfully'
        });
    } catch (error) {
        next(error)
    }
}

// @desc    Get quiz results
// @route   GET /api/v1/quizzes/:id/results
// @access  Private
export const getQuizResults = async (req, res, next) => {
    try {
        const quiz = await Quiz.findOne({ _id: req.params.id, userId: req.user._id }).populate('documentId', 'title')

        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" })
        }

        if(!quiz.completedAt) {
            return res.status(400).json({ message: "Quiz not yet completed" })
        }

        // Build detailed result

        const detailedResult = quiz.questions.map((question, index) => {
            const userAnswer = quiz.userAnswers.find((ans) => ans.questionIndex === index);

            return {
                questionIndex: index,
                question: question.question,
                options: question.options,
                correctAnswer: question.correctAnswer,
                selectedAnswer: userAnswer?.selectedAnswer || null,
                isCorrect: userAnswer?.isCorrect || false,
                explanation: question.explanation,
            }
        })

        res.status(200).json({
            success: true,
            data: {
                quiz:{
                    id: quiz._id,
                    title: quiz.title,
                    document: quiz.documentId,
                    score: quiz.score,
                    totalQuestions: quiz.totalQuestions,
                    completedAt: quiz.completedAt
                },
                results: detailedResult
            }
        });
    } catch (error) {
        next(error)
    }
}

// @desc    Delete a quiz
// @route   DELETE /api/v1/quizzes/:id
// @access  Private
export const deleteQuiz = async (req, res, next) => {
    try {
        const quiz = Quiz.findOne({ _id: req.params.id, userId: req.user._id })

        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" })
        }

        // Implementation for deleting the quiz
        await Quiz.deleteOne();
        res.status(200).json({ success: true, message: "Quiz deleted successfully" });
    } catch (error) {
        next(error)
    }
}