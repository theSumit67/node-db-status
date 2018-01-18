const mysql = require('mysql');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

const config = require('./config/database');

app.use(express.static(path.join(__dirname + '/public')));


var mongoStatus = false;
mongoose.connect(config.database, { useMongoClient: true, poolSize: 5 })
.then(db=>{
    mongoStatus = true;
    console.log(mongoStatus);
    // Use the admin database for the operation
    console.log(db.name + '  ' + db ._hasOpened) ;

    // need to check -?
    // http://mongodb.github.io/node-mongodb-native/2.2/api/Admin.html#listDatabases
    var adminDb = db.admin();
    console.log(adminDb);
    
    // List all the available databases
    adminDb.listDatabases(function (err, dbs) {
        if (err) throw err;
        console.log(dbs.databases.length);
        db.close();
    });
}, err => {
    mongoStatus = false;
    throw err;
});


io.on('connection', function (socket) {
    console.log('A user connected');
    io.emit('mongoStatus', mongoStatus);
});

http.listen(3000, () => {
    console.log('listening on port : 3000');
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