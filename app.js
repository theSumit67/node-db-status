const mysql         = require('mysql');
const mongoose      = require('mongoose');
var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs")

const config = require('./config/database');
const sse = require('./sse');


var mongoStatus = false;
http.createServer(function (request, response) {

    var uri = url.parse(request.url).pathname;
    console.log(uri);
    if ( uri === "/mongo"){
        sse(request, response);
        mongoose.connect(config.database).then(
            () => {
                mongoStatus = true;
                console.log(mongoStatus);
                response.sse.sendEvent("sending", "AA" + mongoStatus);
            },
            err => {
                mongoStatus = false;
                console.log(mongoStatus);
                response.sse.sendEvent("sending", "ZZ" + mongoStatus);
            }
        );
            
    } else{
        var filename = path.join(process.cwd(), uri);

        fs.exists(filename, function (exists) {
            if (!exists) {
                response.writeHead(404, { "Content-Type": "text/plain" });
                response.write("404 Not Found\n");
                response.end();
                return;
            }

            if (fs.statSync(filename).isDirectory()) filename += '/index.html';

            fs.readFile(filename, "binary", function (err, file) {
                if (err) {
                    response.writeHead(500, { "Content-Type": "text/plain" });
                    response.write(err + "\n");
                    response.end();
                    return;
                }

                response.writeHead(200);
                response.write(file, "binary");
                response.end();
            });
        });
    }
    
}).listen(parseInt(8080, 10));

console.log("Static file server running at\n  => http://localhost:8080"  + "/\nCTRL + C to shutdown");


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