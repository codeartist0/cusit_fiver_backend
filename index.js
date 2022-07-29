const app = require('express')();
const mysql = require('mysql');
const cors = require('cors');
const bodyparser = require('body-parser');


app.get('/', function(req, res){
    res.sendfile('main.html');
});

const http = require('http').Server(app);
const con = mysql.createConnection({
    host: "184.168.98.222",
    user: "cusitfiverr",//cusitfiverr
    password: "bilalmalik1230@",
    database: "cusitfiverr"
});
con.connect(function(err) {
    if (err) throw err;
});
let msgCount = 0;
let messages = [];

const io = require("socket.io")(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
});


io.on('connection', function(socket){
    const chatRoomId = socket.handshake.query['userId'];
    console.log(chatRoomId);

    socket.join(chatRoomId);

    socket.on('chat-msg', (msg) => {
        if(!msg['userEmail'].length < 1 || !chatRoomId.length < 1 || !msg['chatText'].length < 1){
            console.log(msg);
            addToMessages(msg['userEmail'],chatRoomId,msg['chatText']);
            io.in(msg['userEmail']).emit("chat-msg",msg);
        }else{
            console.log("ONE OF THE FIELD WAS NULL");
        }
    });

    socket.on('disconnect', () => {
        socket.leave(chatRoomId);
        console.log('user disconnected');
    });
});
http.listen(3000, function(){
    console.log('listening on localhost:3000');
});

function addToMessages(msgTo,msgFrom,msgData) {


        let stmt = `INSERT INTO chat_msg (msg_from, msg_to, data) VALUES ("${msgTo}","${msgFrom}","${msgData}")`;

        con.query(stmt, function (err, result) {
            if (err) throw err;
            console.log(result);
        });


}