var mongoose = require('mongoose');

var orangesSchema = mongoose.Schema({
    batch: Number,
    classification: String,
    date: Date,
    imgs: Array,
    machine_id: Number,
  });

var orangesModel = module.exports = mongoose.model('oranges', orangesSchema);