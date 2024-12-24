import Contest from "../models/contest-model.js";

const getAllContestList = async (req, res): Promise<Express.Response> => {
  return res.status(200).json({
    contests: await Contest.find({}).select(
      "-_id name short_id starting_time ending_time"
    ),
  });
};

const getContestData = async (req, res): Promise<Express.Response> => {
  const contest_id = req.query.contest_id;
  const contest = await Contest.findOne({ slug: contest_id }).select(
    "-participants"
  );
  if (!contest) {
    return res.status(400).json({ message: "Invalid contest id" });
  }
  return res.status(200).json({
    contest_data: {
      name: contest.name,
      short_id: contest.slug,
      starting_time: contest.starting_time,
      ending_time: contest.ending_time,
    },
  });
};

const createContest = async (req, res): Promise<Express.Response> => {
  const { name, starting_time, ending_time } = req.body;
  const contest = new Contest({
    name,
    starting_time,
    ending_time,
  });
  await contest.save();
  return res.status(200).json({
    message: "Contest created successfully",
  });
};

export { getAllContestList, getContestData };
