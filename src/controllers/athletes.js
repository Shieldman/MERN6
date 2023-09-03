const { Athletes, Sports } = require("../models/mongo");

const getAllAthletes = async (req, res, next) => {
  try {
    const { filter } = req.query;
    const nameFilterOptions = {
      name: { $regex: new RegExp(filter, "i") },
    };
    const athletes = await Athletes.find(filter ? nameFilterOptions : {});
    res.status(200).json({ data: athletes });
  } catch (err) {
    res.status(500).json({ data: err.message });
  }
};

const createAthlete = async (req, res, next) => {
  const newAthlete = new Athletes({
    name: req.body.name,
    age: req.body.age,
    year: req.body.year,
    sports: req.body.sports,
  });
  await newAthlete.save();
  res.status(201).json({ data: newAthlete });
};

const getAthleteById = async (req, res, next) => {
  try {
    const { id } = req.params;
    //mongo
    const athletes = await Athletes.findById(id);
    res.status(200).json({ data: athletes });
  } catch (err) {
    res.status(500).json({ data: err.message });
  }
};

const updateAthleteById = async (req, res, next) => {
  const { name, age, year, sports } = req.body;

  try {
    const { id } = req.params;
    const athlete = await Athletes.findByIdAndUpdate(
      id,
      { name, age, year, sports },
      { new: true }
    );
    res.status(200).json({ data: athlete });
  } catch (err) {
    res.status(500).json({ data: err.message });
  }
};

const deleteAthleteById = async (req, res, next) => {
  try {
    const { id } = req.params;
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
