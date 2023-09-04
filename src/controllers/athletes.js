const { Athletes, Sports } = require("../models/mongo");
const { updateSportById } = require("./sports");

const getAllAthletes = async (req, res, next) => {
  try {
    const { filter } = req.query;
    const nameFilterOptions = {
      name: { $regex: new RegExp(filter, "i") },
    };
    const athletes = await Athletes.find(filter ? nameFilterOptions : {}).populate({
      path: "sports",
      model: "Sport",
      select: {
        name: true,
      },
    })
    .lean();
    res.status(200).json({ data: athletes });
  } catch (err) {
    res.status(500).json({ data: err.message });
  }
};

const createAthlete = async (req, res, next) => {
  try {
    const { name, age, year, sports } = req.body;

    // Check if the specified sport exists
    const existingSport = await Sports.findById(sports);
    if (!existingSport) {
      return res.status(400).json({ data: "Sport not found" });
    }

    const newAthlete = new Athletes({
      name,
      age,
      year,
      sports,
    });

    await newAthlete.save();

    existingSport.athletes.push(newAthlete._id)

     await Sports.findByIdAndUpdate(
       existingSport._id,
       { athletes: existingSport.athletes },
     );

    res.status(201).json({ data: newAthlete });
  } catch (err) {
    res.status(500).json({ data: err.message });
  }
};

const getAthleteById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const athlete = await Athletes.findById(id).populate({
      path: "sports",
      model: "Sport",
      select: {
        name: true,
      },
    })
    .lean();
    res.status(200).json({ data: athlete });
  } catch (err) {
    res.status(500).json({ data: err.message });
  }
};

const updateAthleteById = async (req, res, next) => {
  const { name, age, year, sport } = req.body;

  try {
    const { id } = req.params;
    const athlete = await Athletes.findByIdAndUpdate(
      id,
      { name, age, year, sport },
      { new: true }
    );

    // Update the sport's athlete reference
    const existingSport = await Sports.findById(athlete.sport);
    if (existingSport) {
      existingSport.athlete = athlete._id;
      await existingSport.save();
    }

    res.status(200).json({ data: athlete });
  } catch (err) {
    res.status(500).json({ data: err.message });
  }
};

const deleteAthleteById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const athlete = await Athletes.findById(id);

    // If the athlete is associated with a sport, remove the athlete reference from the sport
    if (athlete.sport) {
      const existingSport = await Sports.findById(athlete.sport);
      if (existingSport) {
        existingSport.athlete = null;
        await existingSport.save();
      }
    }

    await Athletes.deleteOne({ _id: id });
    res.status(200).json({ data: "OK" });
  } catch (err) {
    res.status(500).json({ data: err.message });
  }
};

module.exports = {
  getAllAthletes,
  createAthlete,
  getAthleteById,
  updateAthleteById,
  deleteAthleteById,
};
