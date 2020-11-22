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
        "imgs": doc.imgs,
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
      // "_id": lastInserted[0]._id,
      "batch": lastInserted[0].batch,
      "date": lastInserted[0].date,
      "large_oranges": lastInserted[0].large_oranges,
      "machine_id": lastInserted[0].machine_id,
      "medium_oranges": lastInserted[0].medium_oranges,
      "small_oranges": lastInserted[0].small_oranges
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