const mongoose = require('mongoose');

// ScoreSchema tähän
const ScoreSchema = new mongoose.Schema({
  course: {
    type: String,
    required: true,
    max: 50,
  },
  score: {
    type: Number,
    required: true,
  },
});
module.exports = ScoreSchema;
