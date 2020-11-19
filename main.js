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

function checkInternetConection(){
  require('dns').resolve('www.google.com', function(err) {
    if (err) {
       console.log("No intert connection");
       return false;
    } else {
       console.log("Internet connection is avaliable");
       return true;
    }
  });
};

function sendDataToFirebase(){
  firebase
  .firestore()
  .collection("books")
  .add({
    title: "Of Mice and Men",
  })
  .then((ref) => {
    console.log("Added doc with ID: ", ref.id);
    // Added doc with ID:  ZzhIgLqELaoE3eSsOazu
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

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {

  createWindow();

  firebase.initializeApp(firebaseConfig);

  // firebase.firestore().collection("oranges").get().then(
  //   (snapshot) => {
  //     const data = snapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));
  //     console.log("All data in 'books' collection", data);
  //     // [ { id: 'glMeZvPpTN1Ah31sKcnj', title: 'The Great Gatsby' } ]
  //   });

  startDB();
  checkInternetConection();
  


  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
