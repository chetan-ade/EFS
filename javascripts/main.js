var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
var mkdirp = require('mkdirp');
var MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://chetanade:improve619619@efs-zym9f.azure.mongodb.net/test?retryWrites=true";

http.createServer(function (req, res) {
    if (req.url == '/fileuploaded') {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            var email = fields.email;
            var oldpath = files.filetoupload.path;
            var newpath = 'C:/Users/Chetan/Desktop/EFSstorage/' + email + '/' + files.filetoupload.name;
            fs.rename(oldpath, newpath, function (err) {
                if (err) throw err;
                fs.readFile('./html/fileUploaded.html', function (err, data) {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write(data);
                    res.end();
                });
            });
        });
    } else if (req.url == '/uploadFile') {
        //File upload form
        fs.readFile('./html/uploadFile.html', function (err, data) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            res.end();
        });
    } else if (req.url == '/') {
        //main page
        fs.readFile('./html/main.html', function (err, data) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            res.end();
        });
    } else if (req.url == '/register') {
        fs.readFile('./html/register.html', function (err, data) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            res.end();
        });
    } else if (req.url == '/login') {
        fs.readFile('./html/login.html', function (err, data) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            res.end();
        });
    } else if (req.url == '/registerSuccess') {
        //insertInCollection.js
        var form = new formidable.IncomingForm();
        var emailInput;
        var passwordInput;
        form.parse(req, function (err, fields, files) {
            emailInput = fields.email;
            passwordInput = fields.password;
            // console.log("Email: ", emailInput);
            // console.log("password: ", passwordInput);
            MongoClient.connect(url, function (err, db) {
                if (err) throw err;
                var dbo = db.db("EFSDB");
                var myobj = { _id: emailInput, password: passwordInput };
                dbo.collection("users").insertOne(myobj, function (err, res) {
                    if (err) {
                        console.log('email already exists');
                    } else {
                        console.log("1 document inserted");
                        db.close();
                    }
                });
            });
        });
        fs.readFile('./html/registerSuccess.html', function (err, data) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            res.end();
            mkdirp('C:/Users/Chetan/Desktop/EFSstorage/' + emailInput);
        });
    } else if (req.url == '/loginSuccess') {
        //insertInCollection.js
        console.log('login success...');
        var form = new formidable.IncomingForm();
        var emailInput;
        var passwordInput;
        form.parse(req, function (err, fields, files) {
            emailInput = fields.email;
            passwordInput = fields.password;
            // console.log("Email: ", emailInput);
            // console.log("password: ", passwordInput);
            // MongoClient.connect(url, function (err, db) {
            //     if (err) throw err;
            //     var dbo = db.db("EFSDB");
            //     var myobj = { _id: emailInput, password: passwordInput };
            //     dbo.collection("users").insertOne(myobj, function (err, res) {
            //         if (err) {
            //             console.log('email already exists');
            //         } else {
            //             console.log("1 document inserted");
            //             db.close();
            //         }
            //     });
            // });
        });
        fs.readFile('./html/loginSuccess.html', function (err, data) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            res.end();
            // mkdirp('C:/Users/Chetan/Desktop/EFSstorage/' + emailInput);
        });
    }
}).listen(8080);











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