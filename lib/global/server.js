var server = require('http').createServer();
var io = require('socket.io')(server);
io.on('connection', function(client){
  client.on('change', function(data){
  	client.broadcast.emit(data);
  }); 
});
server.listen(5000);