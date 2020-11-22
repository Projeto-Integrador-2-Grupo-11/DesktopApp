// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const mongoose = require('mongoose');
var quantityOrangesController = require('../controller/quantityOrangesController')

async function startDB() {
  await mongoose.connect('mongodb://localhost:27017/orange_classification', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  }).then(console.log("banco conectado"))
}

startDB();

quantityOrangesController.getAllOranges();