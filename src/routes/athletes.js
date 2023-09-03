const express = require("express");
const {
  getAllAthletes,
  createAthlete,
  getAthleteById,
  updateAthleteById,
  deleteAthleteById,
} = require("../controllers/athletes");

const athletesRouter = express.Router();

athletesRouter.get("/", getAllAthletes);
athletesRouter.get("/:id", getAthleteById);
athletesRouter.post("/", createAthlete);
athletesRouter.put("/:id", updateAthleteById);
athletesRouter.delete("/:id", deleteAthleteById);

module.exports = athletesRouter;