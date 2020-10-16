from PyQt5 import QtWidgets, QtCore
from PyQt5.QtWidgets import QMessageBox
from pyqtgraph import PlotWidget, plot
import pyqtgraph as pg
import sys  # We need sys so that we can pass argv to QApplication
import os
from random import randint
from pymongo import MongoClient

MONGO_HOST = 'mongodb://localhost:27017/'
MONGO_DB = 'classificador'
MONGO_PRODUCAO_COL = 'producao'
MONGO_LARANJAS_COL = 'classificacao_laranjas'


class MainWindow(QtWidgets.QMainWindow):

    def __init__(self, *args, **kwargs):
        super(MainWindow, self).__init__(*args, **kwargs)
        self.DBConnection()

        self.graphWidget = pg.PlotWidget()
        self.setCentralWidget(self.graphWidget)

        self.x = list(range(100))  # 100 time points
        self.y = [randint(0, 100) for _ in range(100)]  # 100 data points

        self.graphWidget.setBackground('w')

        pen = pg.mkPen(color=(255, 0, 0))
        self.data_line = self.graphWidget.plot(self.x, self.y, pen=pen)

        # ... init continued ...
        self.timer = QtCore.QTimer()
        self.timer.setInterval(50)
        self.timer.timeout.connect(self.update_plot_data)
        self.timer.start()

    def update_plot_data(self):

        self.x = self.x[1:]  # Remove the first y element.
        # Add a new value 1 higher than the last.
        self.x.append(self.x[-1] + 1)

        self.y = self.y[1:]  # Remove the first
        self.y.append(randint(0, 100))  # Add a new random value.

        self.data_line.setData(self.x, self.y)  # Update the data.

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
w = MainWindow()
w.show()
sys.exit(app.exec_())
