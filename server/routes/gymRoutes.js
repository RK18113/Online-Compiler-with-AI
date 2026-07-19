import express from "express";
import { getQuestions, getQuestionById, seedQuestions, submitCode, getHint, getProgress, getNextQuestion, getUserConceptState, getAdaptiveSession } from "../controllers/gymController.js";

const router = express.Router();

router.get("/questions", getQuestions);
router.get("/questions/:id", getQuestionById);
router.get("/next-question", getNextQuestion);
router.get("/concept-state", getUserConceptState);
router.get("/session", getAdaptiveSession);
router.get("/progress", getProgress);
router.post("/seed", seedQuestions);
router.post("/submit", submitCode);
router.post("/hint", getHint);

export default router;
