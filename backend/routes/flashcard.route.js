import { Router } from "express"
import authorize from "../middlewares/auth.middleware.js";
import { deleteFlashcardSet, getAllFlashcardSets, getFlashcards, reviewFlashcard, toggleStarFlashcard } from "../controllers/flashcard.controller.js";

const flashcardRouter = Router();
flashcardRouter.use(authorize)

flashcardRouter.get('/', getAllFlashcardSets);
flashcardRouter.get('/:documentId', getFlashcards);
flashcardRouter.post('/:cardId/review', reviewFlashcard);
flashcardRouter.put('/:cardId/star', toggleStarFlashcard);
flashcardRouter.delete('/:id', deleteFlashcardSet);

export default flashcardRouter;