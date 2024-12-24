import express from "express";
const router = express.Router();
import {
	getProblemData,
	getAllProblems,
	createProblem,
} from "../controller/problem-controller.js";

// validators
import runValidation from "../validators/index.js";
import {
	getProblemDataValidator,
	createProblemValidator,
} from "../validators/problem-validator.js";

router.get("/", getAllProblems);
router.get(
	"/get-problem",
	getProblemDataValidator,
	runValidation,
	getProblemData
);
router.post("/create", createProblemValidator, runValidation, createProblem);

export default router;
