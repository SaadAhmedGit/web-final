import Problem from "../models/problem-model.js";
import SampleTest from "../models/sample-test-model.js";
SampleTest;

const createProblem = async (req, res) => {
	const problem = req.body;
	try {
		const existing_problem = await Problem.findOne({ slug: problem.slug });
		if (existing_problem) {
			return res
				.status(409)
				.json({ message: "Problem slug already in use" });
		}
		const new_problem = await Problem.create(problem);
		return res.status(201).json({
			message: "Problem created successfully",
			problem_id: new_problem.short_id,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Internal server error" });
	}
};

const getAllProblems = async (req, res) => {
	try {
		const { problem_id, startingRow, count, sortBy } = req.query;
		const problems = await Problem.find(
			{},
			{},
			{ skip: startingRow, limit: count }
		)
			.select("name slug difficulty")
			.sort({ slug: sortBy });
		return res.status(200).json({ problems });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Internal server error" });
	}
};

const getProblemData = async (req, res) => {
	const problem_slug = req.query.slug;

	try {
		const problem = await Problem.findOne({ slug: problem_slug })
			.populate("sample_tests", "test_input test_output explanation")
			.select("-id -__v -hidden_tests -createdAt -updatedAt");
		if (!problem) {
			return res.status(404).json({ message: "Problem not found" });
		}
		return res.status(200).json({
			problem_data: {
				name: problem.name,
				problem_id: problem._id,
				difficulty: problem.difficulty,
				time_lim: problem.time_lim,
				mem_lim: problem.mem_lim,
				statement: problem.statement,
				input_format: problem.input_format,
				output_format: problem.output_format,
				sample_tests: problem.sample_tests,
			},
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Internal server error" });
	}
};

export { getProblemData, getAllProblems, createProblem };
