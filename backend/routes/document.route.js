import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import { deleteDocument, getDocument, getDocuments, updateDocument, uploadDocument } from "../controllers/document.controller.js";
import upload from "../config/multer.js";

console.log(upload);


const documentRouter = Router();

// All routes are protected
documentRouter.use(authorize);

documentRouter.post('/upload', upload.single("file"), uploadDocument);
documentRouter.get('/', getDocuments);
documentRouter.get('/:id', getDocument);
documentRouter.delete('/:id', deleteDocument);
documentRouter.put('/:id', updateDocument);

export default documentRouter;