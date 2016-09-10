var net = require('net');
var WebSocketServer = require('ws').Server;

var wss = new WebSocketServer({port: 8001});

wss.on('connection', function(ws) {
  //-====
  var client = new net.Socket();
  //client.connect(3306, '127.0.0.1', function() {});

  client.on('data', function(data) {
    ws.send(data,{binary:true});
    console.log('socket: ' + data+"\n");
  });

  client.on('close', function() {
	  ws.close();
      console.log('socket closed');
  });
  //-====
  ws.on('message', function(data, flags) {

    if(!flags.binary && data.substr(0,16)=="WebSocket Proxy:"){
      var options=JSON.parse(data.substr(16));
      setting=options;
      client.connect(options.port,options.ip, function() {});
    }else if(!flags.binary && data=="--jump"){ //心跳包
    }else{
      client.write(data);
    }
    //client.write(data);

   if(!(!flags.binary && data=="--jump")) console.log('websocket: %s\n', data);
  });

  ws.on('close', function() {
	  client.destroy();
      console.log('websocket closed\n');
  });

});
