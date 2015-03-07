var express = require('express');
var app = express();
var expressHbs = require('express3-handlebars');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var CronJob = require('cron').CronJob;
var moment = require("moment");

var port = 'COM3';
var serialport = require("serialport");
var SerialPort = serialport.SerialPort;

// mongodb
var Db = require('mongodb').Db;
var Server = require('mongodb').Server;

// Variáveis
var state = 0; // initial state is a closed door.
var arduino;

var sp = new SerialPort(port, {
  parser: serialport.parsers.readline("\n"),
  baudrate: 9600
});


app.engine('hbs', expressHbs({extname:'hbs'}));
app.set('view engine', 'hbs');

// Add support for static files (css, fonts, images, etc.)
app.use(express.static(__dirname + '/public'));

//Recebendo os dados do arduino na porta serial

sp.on("open", function() {
  console.log('<------------------ Servidor Online ------------------>');
  io.sockets.on('connection', function(socket) {
    sp.on('data', function(data) {
      var dados = (data);
      arduino = JSON.parse(dados);
      socket.emit('atualizaDados', dados);
    });
  }); 
});

//Inserindo os registros de sensores no banco de dados de 1 em 1 minuto
new CronJob('0 0 * * * *', function(){
  Db.connect('mongodb://127.0.0.1:27017/Arduino', function(err, db) {

    var sensores = {Temperatura :  arduino.temperatura,
                    Umidade     :  arduino.umidade,
                    Hora        :  moment().format("HH:mm"),
                    Data        :  moment().format("DD/MM/YYYY")};
    //inserindo registros
    db.collection('Sensores').insert(sensores, function(err, records) {
      if (err) throw err;
      console.log("Registros inseridos no banco "+records[0]._id);
    });
  });
},true, "Brazil/Brasilia");


app.get('/', function(req, res){
  var listarDados = function(err, collection) {
    collection.find().sort( { _id : -1 } ).limit(10).toArray(function(err, results) {
      res.render('climatizacao', {'results' : results });
    });
  }

  var Client = new Db('Arduino', new Server('127.0.0.1', 27017, {}), {safe: true});
  Client.open(function(err, pClient) {
    Client.collection('Sensores', listarDados);
  });
});




http.listen(80, function(){

  console.log('Servidor iniciado na porta:  :80');

});

