const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  white:{ type: String},
  black: { type: String},
  status: { type: String, enum: ['waiting', 'ongoing', 'finished','draw','Stalemate'], default: 'waiting' },
}, { timestamps: true });

module.exports = mongoose.model("Game", gameSchema);

