import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY } from "../config/env.js";

if (!GEMINI_API_KEY) {
    console.error('FATAL ERROR: GEMINI_API_KEY is not set');
    process.exit(1);
}

const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});

/**
 * Generate flashcards from text
 * @param {string} text - The text to generate flashcards from
 * @param {number} count - Number of flashcards to generate
 * @returns {Promise<Array<{question: string, answer: string, difficulty: string}>>} - A promise resolving to an array of generated flashcards
 */

export const generateFlashcards = async (text, count = 10) => {
    const prompt = `Generate exactly ${count} educational flashcards from the following text. Format each flashcard as:
    Q: [Clear, specific question]
    A: [Concise, accurate answer]
    D: [Difficulty level: Easy, Medium, or Hard]
    
    Separate each flashcard with "---"

    Text:
    ${text.substring(0, 15000)}`;

    try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: prompt,
        // contents: [{
        //     parts: [{
        //         text: prompt
        //     }]
        // }]
    });
    const generatedText = response.text;

    // Parse the response
    const flashcards = [];
    const cards = generatedText.split('---').filter(c => c.trim());

    for(const card of cards){
        const lines = card.trim().split('\n');
        // let question = '', options = [], correctAnswer = '', explanation = '', difficulty = 'medium';
        let question = '', answer = '', difficulty = 'medium';

        for(const line of lines){
            if(line.trim().startsWith('Q: ')){
                question = line.trim().substring(2).trim();
            } else if(line.trim().startsWith('A: ')){
                answer = line.trim().substring(2).trim();
            } else if(line.trim().startsWith('D: ')){
                const diff = line.trim().substring(2).trim().toLowerCase();
                if(['easy', 'medium', 'hard'].includes(diff)){
                    difficulty = diff;
                }
            }
        }
        if (question && answer) {
            flashcards.push({ question, answer, difficulty });
        }
    }

    return flashcards.slice(0, count);
    }catch(error){
        console.error('Error generating flashcards:', error);
        throw new Error('Failed to generate flashcards');
    }
}


/**
 * Generate quiz questions
 * @param {string} text - The text to generate quiz questions from
 * @param {number} count - Number of quiz questions to generate
 * @returns {Promise<Array<{question: string, options: Array, correctAnswer: string, explanation: string, difficulty: string}>>} - A promise resolving to an array of generated quiz questions
 */

export const generateQuizQuestions = async (text, numQuestions = 5) => {
    const prompt = `Generate exactly ${numQuestions} multiple choice questions from the following text. Format each question as:
    Q: [Question]
    01: [Option 1]
    02: [Option 2]
    03: [Option 3]
    04: [Option 4]
    C: [Correct option - exactly as written above]
    E: [Brief explanation]
    D: [Difficulty level: Easy, Medium, or Hard]
    
    Separate questions with "---"

    Text:
    ${text.substring(0, 15000)}`;

    try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: prompt,
    });
    const generatedText = response.text;

    // Parse the response
    const questions = [];
    const questionBlocks = generatedText.split('---').filter(q => q.trim());

    for(const block of questionBlocks){
        const lines = block.trim().split('\n');
        let question = '', options = [], correctAnswer = '', explanation = '', difficulty = 'medium';

        for(const line of lines){
            const trimmed = line.trim();
            if(trimmed.startsWith('Q: ')){
                question = trimmed.substring(2).trim();
            } else if(trimmed.match(/^0\d: /)){
                options.push(trimmed.substring(3).trim());
            } else if(trimmed.startsWith('C: ')){
                correctAnswer = trimmed.substring(2).trim();
            } else if(trimmed.startsWith('E: ')){
                explanation = trimmed.substring(2).trim();
            } else if(trimmed.startsWith('D: ')){
                const diff = trimmed.substring(2).trim().toLowerCase();
                if(['easy', 'medium', 'hard'].includes(diff)){
                    difficulty = diff;
                }
            }
        }

        if (question && options.length === 4 && correctAnswer) {
            questions.push({ question, options, correctAnswer, explanation, difficulty });
        }
    }

    return questions.slice(0, numQuestions);
    }catch(error){
        console.error('Gemini API error:', error);
        throw new Error('Failed to generate quiz questions');
    }
}


/**
 * Generate document summary
 * @param {string} text - The text to generate document summary from
 * @returns {Promise<string>} - A promise resolving to the generated document summary
 */

export const generateDocumentSummary = async (text) => {
    const prompt = `Provide a concise summary of the following text, highlighting the key concepts, main ideas, and important points. Keep the summary clear and structured.

    Text:
    ${text.substring(0, 20000)}`;

    try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: prompt,
    });
    const generatedText = response.text;
    
    return generatedText;
    }catch(error){
        console.error('Gemini API error:', error);
        throw new Error('Failed to generate document summary');
    }
}


/**
 * Chat with document context
 * @param {string} question - User question
 * @param {Array<Object>} chunks - Relevant document chunks
 * @returns {Promise<string>} - A promise resolving to the generated response
 */

export const chatWithDocumentContext = async (question, chunks) => {
    const context = chunks.map((c, i)=> `[Chunk ${i + 1}]\n${c.content}`).join('\n\n')

    const prompt = `Based on the following context from a document, Analyse the context and answer the user's question. If the answer is not in the context, say so.

    Context:
    ${context}

    Question: ${question}

    Answer:`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: prompt,
        });
        const generatedText = response.text;

        return generatedText;
    } catch (error) {
        console.error('Gemini API error:', error);
        throw new Error('Failed to process chat request');
    }
};


/**
 * Explain a specific concept
 * @param {string} concept - The concept to explain
 * @param {string} context - Relevant context
 * @returns {Promise<string>}
 */

export const explainConcept = async (concept, context) => {
    const prompt = `Explain the concept of "${concept}" based on the following contex.
    Provide a clear, educational explaination that's easy to understand.
    Include examples if relevant.

    Context:
    ${context.substring(0, 10000)}`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: prompt,
        });
        const generatedText = response.text;

        return generatedText;
    } catch (error) {
        console.error('Gemini API error:', error);
        throw new Error('Failed to explain concept');
    }
};
