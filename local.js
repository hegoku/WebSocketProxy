var net = require('net');
var WebSocket = require('ws');

var HOST = '127.0.0.1';
var PORT = 6969;
var SERVER = 'ws://127.0.0.1';

var remote_options={
  ip:'127.0.0.1',
  port:3306
};

net.createServer(function(sock) {
	var ws = new WebSocket(SERVER);
	var jump=null;
    ws.on('open', function() {
        ws.send('WebSocket Proxy:'+JSON.stringify(remote_options));
		jump=setInterval(function() {
           ws.send('--jump');
        }, 500);
    });
    ws.on('message', function(data, flags) {
      sock.write(data);
	  console.log('websocket: '+data+"\n");

    });
	ws.on('close', function() {
	  clearInterval(jump);
	  sock.destroy();
      console.log('websocket closed\n');
	});

    sock.on('data', function(data) {
      ws.send(data,{ binary: true});
      console.log('socket: ' + data+"\n");
    });

    sock.on('close', function(data) {
	  ws.close();
      console.log('CLOSED: ' +sock.remoteAddress + ' ' + sock.remotePort);
    });

}).listen(PORT, HOST);
