var express = require('express');
var app = express.createServer();
var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;

var basePort = 43100;
app.listen(basePort);
var io = require('socket.io').listen(app);


app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));
app.use('/ace/', express.static(__dirname + '/ace/build/src'));

var procs = {};
var reloadProc = function(id) {
    id = +id;
    //    var port = basePort + id;
    
    if (procs[id]) {
        procs[id].kill();
    }
    
    var serverFile = __dirname + '/slaves/' + id + '/server.js';
    console.log('Command: $ ' + serverFile);
    
    var proc = spawn('node', [serverFile]);
    
    var logger = function (data) {
        io.sockets.emit('console', {
            id: id,
            data: data.toString('utf8')
        });
        
        console.log('std#' + id + ':' + data);
    }
    
    proc.stdout.on('data', logger);
    proc.stderr.on('data', logger);
    procs[id] = proc;
}



app.get('/code/:id/:type', function(req, res){
    var id = +req.param('id');
    var filename = (req.param('type') === 'server') ? '/server.js' : '/client.html';
    var dirname = __dirname + '/slaves/' + id;
    
    var read = function() {
        fs.readFile(dirname + filename, 'utf8', function(err, data){
            if (!err) {
                res.send(data);
            } else {
                res.send('Sorry, Some error occured.');
            }
        });
    }
    
    var file = function() {
        path.exists(dirname + filename, function(exists){
            if (exists) {
                read();
            } else {
                fs.readFile(__dirname + '/slaves/99/' + filename, 'utf8', function(err, data){
                    fs.writeFile(dirname + filename, data, read);
                });
            }
        });
    }
    
    path.exists(dirname, function(exists){
        if (exists) {
            file();
        } else {
            fs.mkdir(dirname, 0777, file);
        }
    });
});



app.post('/code/:id/:type', function(req, res){
    var id = +req.param('id');
    var filename = (req.param('type') === 'server') ? '/server.js' : '/client.html';
    var dirname = __dirname + '/slaves/' + id;
    
    fs.writeFile(dirname + filename, req.param('data'), function(err, data){
        if (!err) {
            reloadProc(id);
            res.send('Saved.');
        } else {
            res.send('Sorry, Some error occured.');
        }
    });
});

app.get('/restore/:id', function(req, res){
    var id = +req.param('id');
    procs[id] && procs[id].kill();
    
    var child = exec('rm -R ' + __dirname + '/slaves/' + id,
        function (error, stdout, stderr) {
            console.log('std#' + id + ': ' + stdout.toString());
            console.log('std#' + id + ': ' + stderr.toString());
            if (error !== null) {
                console.log('exec error: ' + error);
            }
            
            res.send('Deleted. Reloading ...');
        });
});



