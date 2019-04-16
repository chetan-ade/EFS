var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
var mkdirp = require('mkdirp');
var MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://chetanade:improve619619@efs-zym9f.azure.mongodb.net/test?retryWrites=true";
var encryptor = require('file-encryptor');
var key = 'My Super Secret Key';

http.createServer(function (req, res) {

    if (req.url == '/') {
        //main page
        fs.readFile('./html/main.html', function (err, data) {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.write(data);
            res.end();
        });
    } else if (req.url == '/login') {
        //when login button on main page is clicked
        fs.readFile('./html/login.html', function (err, data) {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.write(data);
            res.end();
        });
    } else if (req.url == '/loginCheck') {
        //successfull login
        console.log('Checking login...');
        var form = new formidable.IncomingForm();
        var emailInput;
        var passwordInput;
        var filename;
        form.parse(req, function (err, fields, files) {
            emailInput = fields.email;
            passwordInput = fields.password;
            MongoClient.connect(url, {
                useNewUrlParser: true
            }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("EFSDB");
                dbo.collection("users").findOne({
                    _id: emailInput
                }, function (err, result) {
                    if (err) throw err;
                    if (result === null) {
                        console.log('user email does not exists.');
                        res.writeHead(301, {
                            Location: './loginFailed'
                        });
                        res.end();
                    } else {
                        if ((result._id == emailInput) && (result.password == passwordInput)) {
                            fs.readFile('./html/uploadFile.html', function (err, data) {
                                console.log('logged in successfully');
                                res.writeHead(200, {
                                    'Content-Type': 'text/html'
                                });
                                res.write(data);
                                res.write('<input type="hidden" name="email" value="' + emailInput + '">');
                                res.write('</form>');
                                res.write('<h3>Files Owned</h3>');
                                // res.write(""+result.filesOwned);
                                res.write('<form action="./downloadFile" method="post" enctype="multipart/form-data">');
                                res.write('<input type="hidden" name="email" value="' + emailInput + '">');
                                if (result.filesOwned != undefined) {
                                    for (var i = 0; i < result.filesOwned.length; i++) {
                                        filename = result.filesOwned[i];
                                        res.write('<input type="submit" name="filename" value="' + filename + '"/>');
                                        res.write('<br><br>');
                                    }
                                    res.write('</form');
                                } else {
                                    res.write('<h1>No files uploaded...</h1>');
                                }
                                res.write('</body>');
                                res.write('<script>alert("login successfully");</script>');
                                res.write('</html>');
                                res.end();
                            });
                        } else {
                            console.log('wrong password');
                            res.writeHead(301, {
                                Location: './loginFailed'
                            });
                            res.end();
                        }
                    }
                    db.close();
                });
            });
        });
    } else if (req.url == '/loginFailed') {
        //login failed... email/password already exists
        fs.readFile('./html/login.html', function (err, data) {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.write(data);
            res.write('<script>alert("login failed...Wrong email or password.");</script>');
            res.end();
        });
    } else if (req.url == '/register') {
        //when register button on main page is clicked
        fs.readFile('./html/register.html', function (err, data) {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.write(data);
            res.end();
        });
    } else if (req.url == '/registerAgain') {
        //when register button on main page is clicked
        fs.readFile('./html/register.html', function (err, data) {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.write(data);
            res.write('<script>alert("email already exists");</script>');
            res.end();
        });
    } else if (req.url == '/registerCheck') {
        //checking if the email is already present
        console.log('checking register..');
        var form = new formidable.IncomingForm();
        var emailInput;
        var passwordInput;
        form.parse(req, function (err, fields, files) {
            emailInput = fields.email;
            passwordInput = fields.password;
            MongoClient.connect(url, {
                useNewUrlParser: true
            }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("EFSDB");
                dbo.collection("users").findOne({
                    _id: emailInput
                }, function (err, result) {
                    if (err) throw err;
                    if (result === null) {
                        console.log('new email');
                        mkdirp('C:/Users/Chetan/Desktop/EFS/storage/' + emailInput);
                        console.log("1 user's dir created");
                        var myobj = {
                            _id: emailInput,
                            password: passwordInput
                        };
                        dbo.collection("users").insertOne(myobj, function (err, res) {
                            if (err) {
                                console.log('email already exists');
                            } else {
                                console.log("1 user added to database");
                                db.close();
                            }
                        });
                        res.writeHead(301, {
                            Location: './registerSuccess'
                        });
                        res.end();
                    } else {
                        console.log('email already exists..');
                        res.writeHead(301, {
                            Location: './registerAgain'
                        });
                        res.end();
                    }
                    db.close();
                });
            });
        });
    } else if (req.url == '/registerSuccess') {
        //successful registeration
        fs.readFile('./html/main.html', function (err, data) {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.write(data);
            res.write('<script>alert("registered successfully");</script>');
            res.end();
        });
    } else if (req.url == '/uploadFile') {
        //File upload form
        fs.readFile('./html/uploadFile.html', function (err, data) {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.write(data);
            res.end();
        });
    } else if (req.url == '/fileuploaded') {
        //file successfully uploaded
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            var email = fields.email;
            MongoClient.connect(url, {
                useNewUrlParser: true
            }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("EFSDB");
                var myquery = {
                    _id: email
                };
                var newvalues = {
                    $push: {
                        filesOwned: files.filetoupload.name
                    }
                };
                dbo.collection("users").updateOne(myquery, newvalues, function (err, res) {
                    if (err) throw err;
                    console.log('1 file added to filesOwned');
                    db.close();
                });
                var oldpath = files.filetoupload.path;
                var newpath = 'C:/Users/Chetan/Desktop/EFS/storage/' + email + '/' + files.filetoupload.name;
                console.log('1 file uploaded to filesystem');
                fs.rename(oldpath, newpath, function (err) {
                    if (err) throw err;
                    MongoClient.connect(url, {
                        useNewUrlParser: true
                    }, function (err, db) {
                        if (err) throw err;
                        var dbo = db.db("EFSDB");
                        dbo.collection("users").findOne({
                            _id: email
                        }, function (err, result) {
                            if (err) throw err;
                            fs.readFile('./html/uploadFile.html', function (err, data) {
                                res.writeHead(200, {
                                    'Content-Type': 'text/html'
                                });
                                res.write(data);
                                res.write('<input type="hidden" name="email" value="' + email + '">');
                                res.write('</form>');
                                res.write('<h3>Files Owned</h3>');
                                // res.write(""+result.filesOwned);
                                res.write('<form action="./downloadFile" method="post" enctype="multipart/form-data">');
                                res.write('<input type="hidden" name="email" value="' + email + '">');
                                console.log(result);
                                for (var i = 0; i < result.filesOwned.length; i++) {
                                    filename = result.filesOwned[i];
                                    res.write('<input type="submit" name="filename" value="' + filename + '"/>');
                                    res.write('<br><br>');
                                }
                                res.write('</form');
                                res.write('</body>');
                                console.log('file uploaded successfully');
                                res.write('<script>alert("file uploaded successfully");</script>');
                                res.write('</html>');
                                res.end();
                            });
                            db.close();
                        });
                    });
                });
            });
            // var oldpath = files.filetoupload.path;
            // var newpath = 'C:/Users/Chetan/Desktop/EFS/storage/' + email + '/' + files.filetoupload.name;
            // console.log('1 file uploaded to filesystem');

            // fs.rename(oldpath, newpath, function (err) {
            //     if (err) throw err;
            //     MongoClient.connect(url, {
            //         useNewUrlParser: true
            //     }, function (err, db) {
            //         if (err) throw err;
            //         var dbo = db.db("EFSDB");
            //         dbo.collection("users").findOne({
            //             _id: email
            //         }, function (err, result) {
            //             if (err) throw err;
            //             fs.readFile('./html/uploadFile.html', function (err, data) {
            //                 res.writeHead(200, {
            //                     'Content-Type': 'text/html'
            //                 });
            //                 res.write(data);
            //                 res.write('<input type="hidden" name="email" value="' + email + '">');
            //                 res.write('</form>');
            //                 res.write('<h3>Files Owned</h3>');
            //                 // res.write(""+result.filesOwned);
            //                 res.write('<form action="./downloadFile" method="post" enctype="multipart/form-data">');
            //                 res.write('<input type="hidden" name="email" value="' + email + '">');
            //                 console.log(result);
            //                 for (var i = 0; i < result.filesOwned.length; i++) {
            //                     filename = result.filesOwned[i];
            //                     res.write('<input type="submit" name="filename" value="' + filename + '"/>');
            //                     res.write('<br><br>');
            //                 }
            //                 res.write('</form');
            //                 res.write('</body>');
            //                 console.log('file uploaded successfully');
            //                 res.write('<script>alert("file uploaded successfully");</script>');
            //                 res.write('</html>');
            //                 res.end();
            //             });
            //             db.close();
            //         });
            //     });
            // });
            // // Encrypt file.
            // encryptor.encryptFile(newpath,newpath, key, function(err) {
            //     // Encryption complete.
            // });
        });
    } else if (req.url == '/downloadFile') {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            var email = fields.email;
            var filename = fields.filename;
            console.log(email);
            console.log(filename);
            var filepath = 'C:/Users/Chetan/Desktop/EFS/storage/' + email + '/' + filename;
            console.log(filepath);
            var newfilepath = 'C:/Users/Chetan/Desktop/EFS/storage/' + email + '/' + 'DEC' + filename;
            // encryptor.decryptFile(filepath, newfilepath, key, function(err) {
            //     // Decryption complete.
            //   });
            fs.readFile(filepath, function (err, data) {
                res.writeHead(200, {
                    'Content-Disposition': 'attachment;filename=' + filename
                });
                res.write(data);
                res.end();
            });
        });
    }
}).listen(8080);