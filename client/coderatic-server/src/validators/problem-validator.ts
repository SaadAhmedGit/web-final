import { body, query } from "express-validator";

const getProblemDataValidator = [
	query("slug").not().isEmpty().withMessage("Problem slug is required"),
];

const createProblemValidator = [
	body("name")
		.not()
		.isEmpty()
		.withMessage("Name is required")
		.isLength({ min: 3, max: 50 })
		.withMessage("Problem name must be between 3 to 50 characters"),

	body("slug").not().isEmpty().withMessage("Slug is required"),

	body("difficulty")
		.optional()
		.not()
		.isEmpty()
		.withMessage("Difficulty is required")
		.isIn(["Easy", "Medium", "Hard"])
		.withMessage("Invalid difficulty"),

	body("statement")
		.not()
		.isEmpty()
		.withMessage("Problem statement is required")
		.isLength({ min: 10, max: 10000 })
		.withMessage(
			"Problem statement must be between 10 to 10000 characters"
		),

	body("time_lim")
		.not()
		.isEmpty()
		.withMessage("Time limit is required")
		.isInt({ min: 1, max: 10 })
		.withMessage("Time limit must be between 1 and 10 seconds"),

	body("mem_lim")
		.not()
		.isEmpty()
		.withMessage("Memory limit is required")
		.isInt({ min: 16, max: 1024 })
		.withMessage("Memory limit must be between 16 and 1024 MB"),

	body("input_format")
		.not()
		.isEmpty()
		.withMessage("Input format is required")
		.isLength({ max: 1000 })
		.withMessage("Input format must be between 10 to 1000 characters"),

	body("output_format")
		.not()
		.isEmpty()
		.withMessage("Output format is required")
		.isLength({ max: 1000 })
		.withMessage("Output format must be between 10 to 1000 characters"),

	body("constraints")
		.not()
		.isEmpty()
		.withMessage("Constraints is required")
		.isLength({ max: 1000 })
		.withMessage("Constraints must be between 10 to 1000 characters"),
];

export { getProblemDataValidator, createProblemValidator };
