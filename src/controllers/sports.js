const { Athletes, Sports } = require("../models/mongo");

const getAllSports = async (req, res, next) => {
  try {
    const { filter } = req.query;
    const nameFilterOptions = {
      name: { $regex: new RegExp(filter, "i") },
    };

    const sports = await Sports.find(filter ? nameFilterOptions : {})
      .populate({
        path: "athletes",
        model: "Athlete",
        select: {
          name: true,
          age: true,
        },
      })
      .lean();

    res.status(200).json({ data: sports });
  } catch (err) {
    res.status(500).json({ data: err.message });
  }
};

const createSport = async (req, res, next) => {
  try {
    const newSport = new Sports({
      name: req.body.name,
      players: req.body.players,
      country: req.body.country,
      athletes: req.body.athletes,
    });

    await newSport.save();
    res.status(201).json({ data: newSport });
  } catch (err) {
    res.status(500).json({ data: err.message });
  }
};

const getSportById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sport = await Sports.findById(id)
      .populate({
        path: "athletes",
        model: "Athlete",
        select: {
          name: true,
        },
      })
      .lean();
    res.status(200).json({ data: sport });
  } catch (err) {
    res.status(500).json({ data: err.message });
  }
};

const updateSportById = async (req, res, next) => {
  const { name, players, country, athletes } = req.body;

  try {
    const { id } = req.params;
    const sport = await Sports.findByIdAndUpdate(
      id,
      { name, players, country },
      { new: true }
    );

    // If you want to update the athletes associated with the sport, you can use athlete IDs.
    if (athletes && athletes.length > 0) {
      sport.athletes = athletes;
      await sport.save();
    }

    res.status(200).json({ data: sport });
  } catch (err) {
    res.status(500).json({ data: err.message });
  }
};

const deleteSportById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sport = await Sports.findById(id)
      .populate({
        path: "athletes",
        model: "Athlete",
        select: {
          name: true,
        },
      })
      .lean();
    console.log(sport);
    if (sport.athletes.length == 0) {
      await Sports.deleteOne({ _id: id });
      res.status(200).json({ data: "OK" });
    } else {
      res
        .status(409)
        .json({
          data: "This sport still has athletes in it, please delete the Athletes fist",
        });
    }
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
