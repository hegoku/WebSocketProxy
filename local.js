var net = require('net');
var WebSocketClient = require('websocket').client;
var WebSocket = require('ws');

var HOST = '127.0.0.1';
var PORT = 6969;
var SERVER = 'ws://127.0.0.1';

var remote_options={
  ip:'127.0.0.1',
  port:3306
};

var ws ;

net.createServer(function(sock) {

    ws = new WebSocket(SERVER);
    ws.on('open', function() {
        ws.send('WebSocket Proxy:'+JSON.stringify(remote_options));
    });
    ws.on('message', function(data, flags) {
      sock.write(data);
      console.log('websocket: %s\n', data);
    });

    sock.on('data', function(data) {
      ws.send(data,{ binary: true});
      console.log('socket: ' + data+"\n");
    });

    sock.on('close', function(data) {
      console.log('CLOSED: ' +sock.remoteAddress + ' ' + sock.remotePort);
    });

}).listen(PORT, HOST);
