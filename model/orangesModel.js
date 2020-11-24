var mongoose = require('mongoose');

var orangesSchema = mongoose.Schema({
    batch: String,
    classification: String,
    date: Date,
    image: Buffer,
    machine_id: Number,
    good_with_spots: Number,
    bad: Number,
    good_spotless: Number
  });

var orangesModel = module.exports = mongoose.model('oranges', orangesSchema);