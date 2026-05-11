import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import { getDashboard } from "../controllers/progress.controller.js";

const progressRouter = Router();

progressRouter.use(authorize);

progressRouter.get('/dashboard', getDashboard)

export default progressRouter;