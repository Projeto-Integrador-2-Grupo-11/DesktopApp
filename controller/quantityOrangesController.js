var QuantityOranges = require('../model/quantityOrangesModel');
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

var ctx = document.getElementById('myChart');
var ctx2 = document.getElementById('myChart2');

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

function getAllOranges() {
    QuantityOranges.find({}).sort({ _id: -1 }).limit(1).then((lastInserted) => {
        let largeOranges = lastInserted[0].large_oranges;
        let mediumOranges = lastInserted[0].medium_oranges;
        let smallOranges = lastInserted[0].small_oranges;
        let goodOranges = lastInserted[0].good_spotless;
        let goodWithSpotsOranges = lastInserted[0].good_with_spots;
        let badOranges = lastInserted[0].bad;
        let batch = lastInserted[0].batch;
        let dateBatch = lastInserted[0].date;
        let machineID = lastInserted[0].machine_id;
        let total = goodOranges + goodWithSpotsOranges + badOranges;

        let size = {
            datasets: [{
                // vetor com os valores a serem plotados no gráfico
                data: [largeOranges, mediumOranges, smallOranges],
                // propriedade para adicionar cores aos respectivos valores do vetor data
                backgroundColor: ['rgb(55, 99, 132)', 'rgb(255, 199, 132)', 'rgb(255, 99, 132)']
            }],
            // legendas para os respectivos valores do vetor data
            labels: ['Grandes', 'Médias', 'Pequenas']
        };

        let quality = {
          datasets: [{
            // vetor com os valores a serem plotados no gráfico
            data: [goodOranges, goodWithSpotsOranges, badOranges],
            // propriedade para adicionar cores aos respectivos valores do vetor data
            backgroundColor: ['rgb(57, 148, 239)', 'rgb(244, 242, 110)', 'rgb(242, 83, 81)']
        
          }],
          // legendas para os respectivos valores do vetor data
          labels: ['Boas', 'Manchadas', 'Ruins']
        };

        var qualityChart = new Chart(ctx, {
            type: 'pie',
            data: quality,
            options: opcoes
        });

        var sizeChart = new Chart(ctx2, {
            type: 'pie',
            data: size,
            options: opcoes
        });
        fillMetadata(batch, dateBatch, total);
        document.getElementById('machine-id').innerHTML = `ID da Máquina: ${machineID}`;
    })
    setTimeout(getAllOranges, 10000);
}

function fillMetadata(batch, dateBatch, total) {
  let dataFormatada = ((dateBatch.getDate() )) + "/" + ((dateBatch.getMonth() + 1)) + "/" + dateBatch.getFullYear(); 

  document.getElementById('batch').innerHTML = batch;
  document.getElementById('date').innerHTML = dataFormatada;
  document.getElementById('total').innerHTML = total;


}

module.exports.getAllOranges = getAllOranges;