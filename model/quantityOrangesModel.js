var mongoose = require('mongoose');

var quantityOrangesSchema = mongoose.Schema({
    batch: String,
    date: Date,
    large_oranges: Number,
    machine_id: Number,
    medium_oranges: Number,
    small_oranges: Number,
    good_with_spots: Number,
    bad: Number,
    good_spotless: Number
  });

var quantityOrangesModel = module.exports = mongoose.model('quantity_oranges', quantityOrangesSchema);
