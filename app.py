from PyQt5 import QtWidgets, QtCore
from PyQt5.QtWidgets import QMessageBox
from pyqtgraph import PlotWidget, plot
import pyqtgraph as pg
from PyQt5.QtWidgets import QApplication, QMainWindow
from PyQt5.QtChart import QChart, QChartView, QPieSeries, QPieSlice
from PyQt5.QtGui import QPainter, QPen
from PyQt5.QtCore import Qt
import sys
import os
from random import randint
from pymongo import MongoClient

MONGO_HOST = 'mongodb://localhost:27017/'
MONGO_DB = 'classificador'
MONGO_PRODUCAO_COL = 'producao'
MONGO_LARANJAS_COL = 'classificacao_laranjas'


class Window(QMainWindow):
    def __init__(self):
        super().__init__()

        self.setWindowTitle("PyQtChart Pie Chart")
        self.setGeometry(100,100, 1280,600)

        self.show()

        self.create_piechart()



    def create_piechart(self):

        series = QPieSeries()
        series.setLabelsVisible(True)
        series.append("Python", 80)
        series.append("C++", 70)
        series.append("Java", 50)
        series.append("C#", 40)
        series.append("PHP", 30)
        



        #adding slice
        slice = QPieSlice()
        slice = series.slices()[2]
        slice.setExploded(True)
        slice.setLabelVisible(True)
        slice.setPen(QPen(Qt.darkGreen, 2))
        slice.setBrush(Qt.green)

        slice = QPieSlice()
        slice = series.slices()[3]
        slice.setExploded(True)
        slice.setLabelVisible(True)
        slice.setPen(QPen(Qt.red, 2))
        slice.setBrush(Qt.green)

        chart = QChart()
        chart.legend().hide()
        chart.addSeries(series)
        chart.createDefaultAxes()
        chart.setAnimationOptions(QChart.SeriesAnimations)
        chart.setTitle("Pie Chart Example")

        chart.legend().setVisible(True)
        chart.legend().setAlignment(Qt.AlignBottom)

        chartview = QChartView(chart)
        chartview.setRenderHint(QPainter.Antialiasing)

        self.setCentralWidget(chartview)

    # def update_plot_data(self):

    #     self.x = self.x[1:]  # Remove the first y element.
    #     # Add a new value 1 higher than the last.
    #     self.x.append(self.x[-1] + 1)

    #     self.y = self.y[1:]  # Remove the first
    #     self.y.append(randint(0, 100))  # Add a new random value.

    #     self.data_line.setData(self.x, self.y)  # Update the data.

    def DBConnection(self):

        try:
            self.client = MongoClient(MONGO_HOST)
            self.db = self.client[MONGO_DB]
            print('db=\n', self.db, '\n')
            self.coll_producao = self.db[MONGO_PRODUCAO_COL]
            self.coll_laranjas = self.db[MONGO_LARANJAS_COL]
            print('coll_producao=\n', self.coll_producao, '\n')
            QMessageBox.about(self, 'Connection',
                              'Banco de Dados conectado com sucesso')
        except:
            QMessageBox.about(self, 'Connection',
                              'Falha ao conectar com banco de dados')
            # sys.exit(1)


app = QtWidgets.QApplication(sys.argv)
w = Window()
w.show()
sys.exit(app.exec_())
