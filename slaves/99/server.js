// Some magic to make this running
var parts = __dirname.split('/');
var id;

require.paths.push('/var/www/recursive-node/.node_libraries/');
require.paths.push('/var/www/recursive-node/node_libraries/');
require.paths.push('/home/omar/node_libraries/');
require.paths.push('/home/omar/.node_libraries/');
require.paths.push('/root/node_libraries/');
require.paths.push('/root/.node_libraries/');

if (parts[parts.length - 1]) {
    id = +parts[parts.length - 1];
} else if (parts[parts.length - 2]) {
    id = +parts[parts.length - 1];
}

if (!id) {
    id = 99;
}

// Here is your server, code it!
var http = require('http');
var express = require('express');
var io = require('socket.io');
var fs = require('fs');
var url = require('url');

var basePort = 43100;
var myPort = basePort + id;

var app = express.createServer();
app.listen(myPort); 
var io = require('socket.io').listen(app);
app.get('/', function(request, response){
    fs.readFile(__dirname + '/client.html', 'utf8', function(err, data){
        if (!err) response.write(data);
        response.end();
    });
});

io.sockets.on('connection', function (socket) {
  socket.broadcast.emit('message', 'Use connected');
  socket.on('message', function (txt) {
    socket.broadcast.emit('message', txt);
  });
});

console.log('Hello, World');
console.log('Server is running at port: ' + myPort);
