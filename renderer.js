// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
var Chart = require('chart.js');
require('chartjs-plugin-labels');



function splitRgb(rgb) {
  var matchColors = /rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)/;
  var match = matchColors.exec(rgb);
  var result = match;
  return result ? {
    r: parseInt(result[1]),
    g: parseInt(result[2]),
    b: parseInt(result[3])
  } : null;
}


// document.getElementById('title').addEventListener('click', startDB);
var ctx = document.getElementById('myChart');
var ctx2 = document.getElementById('myChart2');

let quality = {
  datasets: [{
    // cria-se um vetor data, com os valores a ser dispostos no gráfico
    data: [10, 20, 30],
    // cria-se uma propriedade para adicionar cores aos respectivos valores do vetor data
    backgroundColor: ['rgb(57, 148, 239)', 'rgb(244, 242, 110)', 'rgb(242, 83, 81)']

  }],
  // cria-se legendas para os respectivos valores do vetor data
  labels: ['Boas', 'Manchadas', 'Ruins']
};

let size = {
  datasets: [{
    // cria-se um vetor data, com os valores a ser dispostos no gráfico
    data: [10, 20, 30],
    // cria-se uma propriedade para adicionar cores aos respectivos valores do vetor data
    backgroundColor: ['rgb(55, 99, 132)', 'rgb(255, 199, 132)', 'rgb(255, 99, 132)']
  }],
  // cria-se legendas para os respectivos valores do vetor data
  labels: ['Grandes', 'Médias', 'Pequenas']
};

let opcoes = {
  cutoutPercentage: 0,
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    labels: {
      render: 'value',
      fontColor: function (data) {
        var rgb = splitRgb(data.dataset.backgroundColor[data.index]);
        var threshold = 140;
        var luminance = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
        return luminance > threshold ? 'black' : 'white';
      },
      precision: 2
    }
  },
  legend: {
    position: 'bottom',
    labels: {
      usePointStyle: true
    }
  }
};

var myPieChart = new Chart(ctx, {
  type: 'pie',
  data: quality,
  options: opcoes
});

var myPieChart2 = new Chart(ctx2, {
  type: 'pie',
  data: size,
  options: opcoes
});