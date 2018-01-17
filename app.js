const mysql = require('mysql');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

const config = require('./config/database');

app.use(express.static(path.join(__dirname)));
// app.use(express.static(path.join(__dirname + 'public')));

app.get('/dummy', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

var mongoStatus = false;
io.on('connection', function (socket) {
    console.log('a user connected');
    mongoose.connect(config.database, {
            useMongoClient: true
        })
        .then(
            () => {
                mongoStatus = true;
                console.log(mongoStatus);
                io.emit('mongoStatus', mongoStatus);
            },
            err => {
                mongoStatus = false;
                console.log(mongoStatus);
                io.emit('mongoStatus', mongoStatus);
            }
        );
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});





// MYSQL
/*
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'me',
    password: 'secret',
    database: 'my_db'
});


connection.connect();

connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0].solution);
});

connection.end();
*/