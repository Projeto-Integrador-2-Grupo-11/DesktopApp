// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const mongoose = require('mongoose');

async function startDB(){
    // console.log("au")
    await mongoose.connect('mongodb://localhost:27017/classificador', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
      }).then(alert("banco conectado"))
}

document.getElementById('title').addEventListener('click', startDB);
