//引入http模块
var http = require('http'),
    //创建一个服务器
    server = http.createServer(function(req, res) {
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.write('hello world!');
        res.end();
    });

console.log('jesse server started');

server = http.createServer(function(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/html' //将返回类型由text/plain改为text/html
    });
    res.write('<h1>hello world!</h1>'); //返回HTML标签
    res.end();
});

var express = require('express'), //引入express模块
    app = express(),
    server = require('http').createServer(app);
app.use('/', express.static(__dirname + '/www')); //指定静态HTML文件的位置




//服务器及页面部分
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    users=[];//保存所有在线用户的昵称
app.use('/', express.static(__dirname + '/www'));
app.listen(process.env.PORT || 3000, function(){


    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
   
   
   });


//socket部分
io.sockets.on('connection', function(socket) {
    //new user login
    socket.on('login', function(nickname) {
        if (users.indexOf(nickname) > -1) {
            socket.emit('nickExisted');
        } else {
            //socket.userIndex = users.length;
            socket.nickname = nickname;
            users.push(nickname);
            socket.emit('loginSuccess');
            io.sockets.emit('system', nickname, users.length, 'login');
        };
    });
    //user leaves
    socket.on('disconnect', function() {
        if (socket.nickname != null) {
            //users.splice(socket.userIndex, 1);
            users.splice(users.indexOf(socket.nickname), 1);
            socket.broadcast.emit('system', socket.nickname, users.length, 'logout');
        }
    });
    //new message get
    socket.on('postMsg', function(msg, color) {
        socket.broadcast.emit('newMsg', socket.nickname, msg, color);
    });
    //new image get
    socket.on('img', function(imgData, color) {
        socket.broadcast.emit('newImg', socket.nickname, imgData, color);
    });

    //接收用户发来的图片
 socket.on('img', function(imgData) {
    //通过一个newImg事件分发到除自己外的每个用户
     socket.broadcast.emit('newImg', socket.nickname, imgData);
 });

});
