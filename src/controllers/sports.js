const { Athletes, Sports } = require("../models/mongo");

const getAllSports = async (req, res, next) => {
  try {
    const { filter } = req.query;
    const nameFilterOptions = {
      name: { $regex: new RegExp(filter, "i") },
    };
    const sports = await Sports.find(filter ? nameFilterOptions : {});
    res.status(200).json({ data: sports });
  } catch (err) {
    res.status(500).json({ data: err.message });
  }
};

const createSport = async (req, res, next) => {
  const newSport = new Sports({
    name: req.body.name,
    age: req.body.age,
    year: req.body.year,
    sports: req.body.sports,
  });
  await newSport.save();
  res.status(201).json({ data: newSport });
};

const getSportById = async (req, res, next) => {
  try {
    const { id } = req.params;
    //mongo
    const sports = await Sports.findById(id);
    res.status(200).json({ data: sports });
  } catch (err) {
    res.status(500).json({ data: err.message });
  }
};

const updateSportById = async (req, res, next) => {
  const { name, age, year, sports } = req.body;

  try {
    const { id } = req.params;
    const sport = await Sports.findByIdAndUpdate(
      id,
      { name, age, year, sports },
      { new: true }
    );
    res.status(200).json({ data: sport });
  } catch (err) {
    res.status(500).json({ data: err.message });
  }
};

const deleteSportById = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Sports.deleteOne({ _id: id });
    res.status(200).json({ data: "OK" });
  } catch (err) {
    res.status(500).json({ data: err.message });
  }
};

module.exports = {
  getAllSports,
  createSport,
  getSportById,
  updateSportById,
  deleteSportById,
};