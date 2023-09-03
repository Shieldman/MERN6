const express = require("express");
const {
  getAllSports,
  createSport,
  getSportById,
  updateSportById,
  deleteSportById,
} = require("../controllers/sports");

const sportsRouter = express.Router();

sportsRouter.get("/", getAllSports);
sportsRouter.get("/:id", getSportById);
sportsRouter.post("/", createSport);
sportsRouter.put("/:id", updateSportById);
sportsRouter.delete("/:id", deleteSportById);

module.exports = sportsRouter;