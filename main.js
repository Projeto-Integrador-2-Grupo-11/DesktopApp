//----IMPORTS----
const { app, BrowserWindow } = require('electron')
const path = require('path')
const mongoose = require('mongoose');
const firebase = require("firebase/app");
var QuantityOranges = require('./model/quantityOrangesModel');
var Oranges = require('./model/orangesModel');
require("firebase/auth");
require("firebase/firestore");

//----VARIABLES----
const TIME = 1800; //TIME IN SECONDS
const firebaseConfig = {
  apiKey: "AIzaSyCboa08hL9h2vVIKp11gvNDCgwxCyhztI4",
  authDomain: "seletor-frutas.firebaseapp.com",
  databaseURL: "https://seletor-frutas.firebaseio.com",
  projectId: "seletor-frutas",
  storageBucket: "seletor-frutas.appspot.com",
  messagingSenderId: "687514495840"
};


//----FUNCTIONS----
async function startDB() {
  // console.log("au")
  await mongoose.connect('mongodb://localhost:27017/classificador', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  }).then(console.log("DATA BASE CONNECTED"))
}

function syncDataBase() {
  console.log('SYNCING DATA');
  sendQuantityOrangesToFirebase();
  sendOrangesToFirebase();
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



function sendOrangesToFirebase() {

  var db = firebase.firestore();

  Oranges.find({}).then((oranges) => {

    var obj; 
    var batch = db.batch();

    oranges.forEach((doc) => {

      obj = {
        "batch": doc.batch,
        "classification": doc.classification,
        "image": doc.image.toString(),
        // "image": +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",
        "date": doc.date,
        "machine_id": doc.machine_id
      }

      batch.set(db.collection("oranges").doc(doc._id.toString()), Object.assign({}, obj));
    });

    batch.commit().then((ref) => {
      console.log("Added batch: ", ref);
    });
  });
}

function sendQuantityOrangesToFirebase() {
  var db = firebase.firestore();
  var obj;

  QuantityOranges.find({}).sort({ _id: -1 }).limit(1).then((lastInserted) => {

    var obj = {
      "batch": lastInserted[0].batch,
      "date": lastInserted[0].date,
      "large_oranges": lastInserted[0].large_oranges,
      "machine_id": lastInserted[0].machine_id,
      "medium_oranges": lastInserted[0].medium_oranges,
      "small_oranges": lastInserted[0].small_oranges,
      "good_with_spots":lastInserted[0].good_with_spots,
      "bad":lastInserted[0].bad,
      "good_spotless":lastInserted[0].good_spotless
    }

    var identificator = lastInserted[0]._id;

    if (lastInserted[0]._id) {
      db.collection("quantity_oranges").doc(identificator.toString()).set(Object.assign({}, obj));
      // console.log(lastInserted[0]._id);
    }

  })

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
  mainWindow.loadFile('./view/index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {

  startDB();
  firebase.initializeApp(firebaseConfig);

  createWindow();

  setInterval(async () => {
    checkInternetConection();
  }, TIME);

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})