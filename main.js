// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const path = require('path')
const mongoose = require('mongoose');
const firebase = require("firebase/app");

require("firebase/auth");
require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyCboa08hL9h2vVIKp11gvNDCgwxCyhztI4",
  authDomain: "seletor-frutas.firebaseapp.com",
  databaseURL: "https://seletor-frutas.firebaseio.com",
  projectId: "seletor-frutas",
  storageBucket: "seletor-frutas.appspot.com",
  messagingSenderId: "687514495840"
};

async function startDB() {
  // console.log("au")
  await mongoose.connect('mongodb://localhost:27017/classificador', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  }).then(console.log("banco conectado"))
}

function syncDataBase(){
  console.log('SYNC');
}

function checkInternetConection() {

  require('dns').resolve('www.google.com', function (err) {
    if (err) {
      console.log("No intert connection");
    } else {
      console.log("Internet connection is avaliable");
      syncDataBase();
    }
  });
};

function sendDataToFirebase(collection) {

  // var array = [
  //   {
  //     batch: 1,
  //     classification: 'good_with_spots',
  //     date: '8 de outubro de 2020 15:00:00 UTC-3',
  //     imgs: ["img1", "img2"],
  //     machine_id: 1
  //   },
  //   {
  //     batch: 1,
  //     classification: 'good_without_spots',
  //     date: '8 de outubro de 2020 15:15:00 UTC-3',
  //     imgs: ["img1", "img2"],
  //     machine_id: 1
  //   }
  // ]

  var db = firebase.firestore();
  var batch = db.batch();

  collection.forEach((doc) => {
    var docRef = db.collection("oranges").doc(); //automatically generate unique id
    batch.set(docRef, doc);
  });

  batch.commit().then((ref) => {
    console.log("Added batch: ", ref);
  });
}

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {

  startDB();
  firebase.initializeApp(firebaseConfig);
  createWindow();
  // sendDataToFirebase();
  setInterval(async () => {
    checkInternetConection();
  }, 1800);
  checkInternetConection();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})