// NPM INSTALL SERIALPORT
// NPM INSTALL JSON

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

const SerialPort = require('serialport');
const parsers = SerialPort.parsers;
var serial = new SerialPort('/dev/ttyACM0', {
  baudRate: 9600, autoOpen: false
});
const parser = new parsers.Readline({delimiter: '\r\n',});
serial.pipe(parser);

var pedir;

app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/principal.html');
});
server.listen(8080, function () {
    console.log('Example app listening on port 8080!');
});

io.on("connection", function (socket) {
    console.log("Numero de conexiones: " + Object.keys(io.sockets.connected).length);
    socket.on('disconnect', function() {
        if(Object.keys(io.sockets.connected).length == 0){
            console.log("Desconeccion total detectada, deteniendo serial...");
            clearInterval(pedir);
            serial.close();
        }
    });
    if(Object.keys(io.sockets.connected).length == 1){
        serial.open(function (err) {
            if (err) {
              return console.log('Error opening port: ', err.message)
            }
        });
        serial.on('open', function () {
            pedir = setInterval(function(){
                serial.write("a");
                console.log("pidiendo datos....");
            }, 1000);
        });
    }
    //lectura de datos del arduino
    parser.on('data', function (data) {
        var a = data.split(",");
        console.log(a);
        socket.emit("sens", {humedad : a[1], temperatura : a[0]});
    });
    socket.on("registro", function (data) {
        console.log("Hora de inicio: " + data.inicio + ", Hora de finalizado: " + data.fin + ", Cada " + data.dias + " dias");
    });
    socket.on("start", function () {
        console.log("start");
        serial.write("s");
    });
    socket.on("stop", function () {
        console.log("stop");
        serial.write("r");
    });
});