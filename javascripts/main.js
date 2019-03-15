var http = require('http');
var formidable = require('formidable');
var fs = require('fs');

http.createServer(function (req, res) {
    if (req.url == '/fileuploaded') {
        //file upload page
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            var oldpath = files.filetoupload.path;
            var newpath = 'C:/Users/Chetan/Desktop/EFSstorage/' + files.filetoupload.name;
            fs.rename(oldpath, newpath, function (err) {
                if (err) throw err;
                fs.readFile('./html/fileUploaded.html', function(err, data) {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write(data);
                    res.end();
                });
            });
        });
    } else if (req.url == '/uploadFile') {
        //File upload form
        fs.readFile('./html/uploadFile.html', function(err, data) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
          });
    } else if (req.url == '/') {
        fs.readFile('./html/main.html', function(err, data) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
          });
    } else if (req.url == '/register') {
        fs.readFile('./html/register.html', function(err, data) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
          });
    } else if (req.url == '/login') {
        fs.readFile('./html/login.html', function(err, data) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
          });
    }
}).listen(8080);










// var MongoClient = require('mongodb').MongoClient;
// const url = "mongodb+srv://chetanade:improve619619@efs-zym9f.azure.mongodb.net/test?retryWrites=true";

//insertInCollection.js
// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("EFSDB");
//   var myobj = { name: "Chetan", address: "aa 37" };
//   dbo.collection("users").insertOne(myobj, function(err, res) {
//     if (err) throw err;
//     console.log("1 document inserted");
//     db.close();
//   });
// }); 

// createCollection.js▐
// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("EFSDB");
//   dbo.createCollection("users", function(err, res) {
//     if (err) throw err;
//     console.log("Collection created!");
//     db.close();
//   });
// }); 