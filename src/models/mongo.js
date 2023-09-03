const mongoose = require('mongoose')

const emptySchema = new mongoose.Schema({});

const Athletes = mongoose.model('Athlete',emptySchema);
const Sports = mongoose.model('Sport',emptySchema);

module.exports = {
    Athletes,
    Sports
}