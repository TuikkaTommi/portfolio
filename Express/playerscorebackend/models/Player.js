const mongoose = require('mongoose');
const ScoreSchema = require('./Score');

const PlayerSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, max: 20 },
  email: { type: String, required: true, unique: true, max: 80 },
  roundsplayed: { type: Number, required: false, min: 0 },
  scores: { type: [ScoreSchema], required: true },
});

// tehdään PlayerSchemasta model
const Player = mongoose.model('Player', PlayerSchema);

module.exports = Player;
