// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const mongoose = require('mongoose');
var Chart = require('chart.js');

async function startDB(){
    // console.log("au")
    await mongoose.connect('mongodb://localhost:27017/classificador', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
      }).then(console.log("banco conectado"))
}

// document.getElementById('title').addEventListener('click', startDB);
var ctx = document.getElementById('myChart');
var ctx2 = document.getElementById('myChart2');

let dados = {
  datasets: [{
      // cria-se um vetor data, com os valores a ser dispostos no gráfico
      data: [10, 20, 30],
      // cria-se uma propriedade para adicionar cores aos respectivos valores do vetor data
      backgroundColor: ['rgb(55, 99, 132)', 'rgb(255, 199, 132)', 'rgb(255, 99, 132)']

  }],
  // cria-se legendas para os respectivos valores do vetor data
  labels: ['Boas', 'Manchadas', 'Ruins']
};

let opcoes = {
  cutoutPercentage: 0,
  responsive: true,
  maintainAspectRatio: false,
  legend: {
    position: 'bottom',
    labels: {
      usePointStyle: true
    }
  }
};

startDB();

var myPieChart = new Chart(ctx, {
  type: 'pie',
  data: dados,
  options: opcoes
});

var myPieChart2 = new Chart(ctx2, {
  type: 'pie',
  data: dados,
  options: opcoes
});