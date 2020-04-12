var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
var mkdirp = require('mkdirp');
var MongoClient = require('mongodb').MongoClient;
var encryptor = require('file-encryptor');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');
var key = 'My Super Secret Key';
const url = "mongodb+srv://chetanade:improve619619@efs-zym9f.azure.mongodb.net/test?retryWrites=true";
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var cypherKey = "mySecretKey";

function encryptFunc(text) {
    var cipher = crypto.createCipher('aes-256-cbc', cypherKey)
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

function decryptFunc(text) {
    var decipher = crypto.createDecipher('aes-256-cbc', cypherKey)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}


console.log("Go to http://localhost:8080/")
encryptEverything = false

http.createServer(function (req, res) {

    if (req.url == '/') {
        //Home Page
        fs.readFile('./html/index.html', function (err, data) {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.write(data);
            res.end();
        });

    } else if (req.url == '/loginCheck') {
        // Checking Login
        console.log('\nChecking login...');
        var form = new formidable.IncomingForm();
        var emailInput;
        var passwordInput;
        var filename;

        form.parse(req, function (err, fields, files) {
            emailInput = fields.email;
            passwordInput = fields.password;
            if (encryptEverything) {
                emailInput = encryptFunc(emailInput);
                passwordInput = encryptFunc(passwordInput);
            }
            MongoClient.connect(url, {
                useNewUrlParser: true
            }, function (err, db) {
                if (err) throw err;

                var dbo = db.db("EFSDB");
                dbo.collection("users").findOne({
                    _id: emailInput
                }, function (err, result) {
                    if (err) throw err;

                    // Email Does not exists
                    if (result === null) {
                        console.log('user email does not exists.');
                        res.writeHead(301, {
                            Location: './loginFailed'
                        });
                        res.end();

                    } else {
                        if ((result._id == emailInput) && (result.password == passwordInput)) {
                            fs.readFile('./html/home.html', function (err, data) {
                                console.log('logged in successfully');
                                res.writeHead(200, {
                                    'Content-Type': 'text/html'
                                });
                                res.write(data);

                                // Adding contents to Homepage from MongoDB database 1 - On log in
                                res.write('<input type="hidden" name="email" value="' + emailInput + '">');
                                res.write('<input type="hidden" name="username" value="' + result.username + '">');
                                res.write('</form>');
                                res.write('<h3>Files Owned</h3>');
                                res.write('<form action="./downloadFile" method="post" enctype="multipart/form-data">');
                                res.write('<input type="hidden" name="email" value="' + emailInput + '">');
                                res.write('<input type="hidden" name="username" value="' + result.username + '">');
                                if (result.filesOwned != undefined) {
                                    for (var i = 0; i < result.filesOwned.length; i++) {
                                        filename = result.filesOwned[i];
                                        res.write('<input type="submit" name="filename" value="' + filename + '"/>');
                                        res.write('<br><br>');
                                    }
                                } else {
                                    res.write('<h4>No files uploaded...</h1>');
                                }
                                res.write('</form>');
                                res.write('<h3>Files Sharing</h3>');
                                res.write('<br>');
                                res.write('<form action="./shareFile" method="post" enctype="multipart/form-data">');
                                if (result.filesOwned != undefined) {
                                    res.write('<input type="hidden" name="email" value="' + emailInput + '">');
                                    res.write('<input type="hidden" name="username" value="' + result.username + '">');
                                    res.write('<h4>Enter File to Share</h4>');
                                    res.write('<select name="filetoshare">');
                                    for (var i = 0; i < result.filesOwned.length; i++) {
                                        res.write('<option value="' + result.filesOwned[i] + '">' + result.filesOwned[i] + '</option>');
                                    }
                                    res.write('</select>');
                                    res.write('<br>');
                                    res.write('<br>');
                                    res.write('<input type="text" name="persontoshare" placeholder="Enter username">');
                                    res.write('<br>');
                                    res.write('<br>');
                                    res.write('<input type="submit" >');

                                } else {
                                    res.write('<h4>No files available to share<h5>');
                                }
                                res.write('</form>');
                                res.write('<h3>Files Shared With Me</h3>');
                                res.write('<form action="./downloadSharedFile" method="post" enctype="multipart/form-data">');
                                if (result.filesSharedWithMe != undefined) {
                                    for (var i = 0; i < result.filesSharedWithMe.length; i++) {
                                        filename = result.filesSharedWithMe[i].filename;
                                        res.write('<input type="submit" name="filename" value="' + filename + ' : ' + result.filesSharedWithMe[i].username + '"/>');
                                        res.write('<br><br>');
                                    }
                                } else {
                                    res.write('<h4>No files shared with me...</h1>');
                                }
                                res.write('</form>');
                                res.write('<script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>');
                                res.write('<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>');
                                res.write('<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>');
                                res.write('</body>');
                                res.write('<div class="alert alert-success alert-dismissible fade show" role="alert" style="margin-left:20px ; margin-right: 20px;">');
                                res.write('Logged in Successfully');
                                res.write('<button type="button" class="close" data-dismiss="alert" aria-label="Close">');
                                res.write('<span aria-hidden="true">&times;</span>');
                                res.write('</button>');
                                res.write('</div>');
                                // res.write('<div style="position: fixed; top:58%;left: 37.4%; width: 25.3%; text-align: center;color: green;">');
                                // res.write('Logged in Successfully');
                                // res.write('</div>');
                                // res.write('</html>');
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
        fs.readFile('./html/index.html', function (err, data) {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.write(data);
            // res.write('<div class="alert alert-danger alert-dismissible fade show" role="alert" style="margin-left:20px ; margin-right: 20px;">');
            // res.write('Login failed... Wrong email or password');
            // res.write('<button type="button" class="close" data-dismiss="alert" aria-label="Close">');
            // res.write('<span aria-hidden="true">&times;</span>');
            // res.write('</button>');
            // res.write('</div>');
            res.write('<div id="message" style="position: fixed; top:58%;left: 37.4%; width: 25.3%; text-align: center;">');
            res.write('<a class="a_danger" href="javascript:removeMsg()">Login failed... Wrong Email or Password</a>');
            res.write('</div>');
            res.end();
        });


    } else if (req.url == '/registerAgain') {
        fs.readFile('./html/index.html', function (err, data) {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.write(data);
            // res.write('<div class="alert alert-danger alert-dismissible fade show" role="alert" style="margin-left:20px ; margin-right: 20px;">');
            // res.write('Email Already Exists');
            // res.write('<button type="button" class="close" data-dismiss="alert" aria-label="Close">');
            // res.write('<span aria-hidden="true">&times;</span>');
            // res.write('</button>');
            // res.write('</div>');
            res.write('<div id="message" style="position: fixed; top:58%;left: 37.4%; width: 25.3%; text-align: center;">');
            res.write('<a class="a_danger" href="javascript:removeMsg()">Email Already Exists</a>');
            res.write('</div>');
            res.end();
        });

    } else if (req.url == '/registerCheck') {
        //checking if the email is already present
        console.log('\nchecking register..');
        var form = new formidable.IncomingForm();
        var emailInput;
        var passwordInput;
        var usernameInput;
        form.parse(req, function (err, fields, files) {
            emailInput = fields.email;
            passwordInput = fields.password;
            usernameInput = fields.username;
            if (encryptEverything) {
                emailInput = encryptFunc(emailInput);
                passwordInput = encryptFunc(passwordInput);
                usernameInput = encryptFunc(usernameInput);
            }
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
                        mkdirp('./storage/' + usernameInput);
                        console.log("1 user's dir created");
                        var myobj = {
                            _id: emailInput,
                            username: usernameInput,
                            password: passwordInput
                        };
                        dbo.collection("users").insertOne(myobj, function (err, res) {
                            if (err) {
                                console.log('Email already exists');
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
        fs.readFile('./html/index.html', function (err, data) {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.write(data);
            // res.write('<div class="alert alert-success alert-dismissible fade show" role="alert" style="margin-left:20px ; margin-right: 20px;">');
            // res.write('Registered Successfully');
            // res.write('<button type="button" class="close" data-dismiss="alert" aria-label="Close">');
            // res.write('<span aria-hidden="true">&times;</span>');
            // res.write('</button>');
            // res.write('</div>');
            res.write('<div id="message" style="position: fixed; top:58%;left: 37.4%; width: 25.3%; text-align: center;">');
            res.write('<a class="a_success" href="javascript:removeMsg()">Registered Successfully</a>');
            res.write('</div>');
            res.end();
        });

    } else if (req.url == '/uploadFile') {
        //File upload form
        fs.readFile('./html/home.html', function (err, data) {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.write(data);
            res.end();
        });

    } else if (req.url == '/fileuploaded') {
        //file successfully uploaded
        var form = new formidable.IncomingForm();
        var newfilepath;
        console.log('\nINSIDE FILE UPLOADED FUNCTION');
        form.parse(req, function (err, fields, files) {
            var email = fields.email;
            var username = fields.username;
            console.log('email of owner of file: ', email);
            console.log('username of owner of file: ', username)
            console.log('file name: ', files.filetoupload.name);
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
                    console.log('1 file added to filesOwnedDB');
                    db.close();
                });

                var oldpath = files.filetoupload.path;
                newfilepath = './storage/' + username + '/' + files.filetoupload.name;
                console.log('oldpath: ', oldpath);
                console.log('newfilepath: ', newfilepath);
                fs.rename(oldpath, newfilepath, function (err) {
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
                            fs.readFile('./html/home.html', function (err, data) {
                                res.writeHead(200, {
                                    'Content-Type': 'text/html'
                                });
                                res.write(data);
                                // Adding contents to Homepage from MongoDB database 2 - on file upload
                                res.write('<input type="hidden" name="email" value="' + email + '">');
                                res.write('<input type="hidden" name="username" value="' + username + '">');
                                res.write('</form>');
                                res.write('<h3>Files Owned</h3>');
                                res.write('<form action="./downloadFile" method="post" enctype="multipart/form-data">');
                                res.write('<input type="hidden" name="email" value="' + email + '">');
                                res.write('<input type="hidden" name="username" value="' + username + '">');
                                // console.log(result);
                                for (var i = 0; i < result.filesOwned.length; i++) {
                                    filename = result.filesOwned[i];
                                    res.write('<input type="submit" name="filename" value="' + filename + '"/>');
                                    res.write('<br><br>');
                                }
                                res.write('</form>');
                                res.write('<h3>Files Sharing</h3>');
                                res.write('<br>');
                                res.write('<form action="./shareFile" method="post" enctype="multipart/form-data">');
                                if (result.filesOwned != undefined) {
                                    res.write('<input type="hidden" name="email" value="' + email + '">');
                                    res.write('<input type="hidden" name="username" value="' + username + '">');
                                    res.write('<h4>Enter File to Share</h4>');
                                    res.write('<select name="filetoshare">');
                                    for (var i = 0; i < result.filesOwned.length; i++) {
                                        res.write('<option value="' + result.filesOwned[i] + '">' + result.filesOwned[i] + '</option>');
                                    }
                                    res.write('</select>');
                                    res.write('<br>');
                                    res.write('<br>');
                                    res.write('<input type="text" name="persontoshare" placeholder="Enter username">');
                                    res.write('<br>');
                                    res.write('<br>');
                                    res.write('<input type="submit" >');
                                } else {
                                    res.write('<h4>No files available to share<h5>');
                                }
                                res.write('</form>');
                                res.write('<h3>Files Shared With Me</h3>');
                                res.write('<form action="./downloadSharedFile" method="post" enctype="multipart/form-data">');
                                if (result.filesSharedWithMe != undefined) {
                                    for (var i = 0; i < result.filesSharedWithMe.length; i++) {
                                        filename = result.filesSharedWithMe[i].filename;
                                        res.write('<input type="submit" name="filename" value="' + filename + ' : ' + result.filesSharedWithMe[i].username + '"/>');
                                        res.write('<br><br>');
                                    }

                                } else {
                                    res.write('<h4>No files shared with me...</h1>');
                                }
                                res.write('</form>');
                                res.write('<script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>');
                                res.write('<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>');
                                res.write('<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>');
                                res.write('</body>');
                                console.log('file uploaded successfully');
                                res.write('<div class="alert alert-success alert-dismissible fade show" role="alert" style="margin-left:20px ; margin-right: 20px;">');
                                res.write('File Uploaded Successfully');
                                res.write('<button type="button" class="close" data-dismiss="alert" aria-label="Close">');
                                res.write('<span aria-hidden="true">&times;</span>');
                                res.write('</button>');
                                res.write('</div>');
                                // res.write('<div style="position: fixed; top:58%;left: 37.4%; width: 25.3%; text-align: center;color: green;">');
                                // res.write('Logged in Successfully');
                                // res.write('</div>');
                                // res.write('</html>');
                                res.end();
                                var temp = newfilepath.split(".")
                                temp[temp.length - 1] = "dat"
                                var newfilepathDAT = temp.join(".");
                                encryptor.encryptFile(newfilepath, newfilepathDAT, key, function (err) {
                                    console.log('file encrypted');
                                    console.log('source: ', newfilepath);
                                    console.log('dest: ', newfilepathDAT);
                                    fs.unlink(newfilepath, function (err) {
                                        if (err) throw err;
                                        console.log('Plain File deleted!');
                                    });
                                });
                            });
                            db.close();
                        });
                    });
                });

            });

        });
    } else if (req.url == '/downloadFile') {
        console.log("\nINSIDE DOWNLOAD FILE FUNCTION")
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            var email = fields.email;
            var username = fields.username;
            var filename = fields.filename.split(':')[0]
            var filenameFH = filename.split('.')[0];
            var filenameSH = filename.split('.')[1]
            var extension = filenameSH.split(':')[0];
            console.log("Email:", email);
            console.log("filename:", filename);
            console.log("filenameFH:", filenameFH);
            console.log("extension:", extension);
            var filepath = './storage/' + username + '/' + filenameFH + '.dat';
            console.log("Filepath:", filepath);
            var newfilepath = './storage/' + username + '/' + filename;
            console.log("NewFilePath:", newfilepath);
            encryptor.decryptFile(filepath, newfilepath, key, function (err) {
                fs.readFile(newfilepath, function (err, data) {
                    res.writeHead(200, {
                        'Content-Disposition': 'attachment;filename=' + filename
                    });
                    res.write(data);
                    res.end();
                    fs.unlink(newfilepath, function (err) {
                        if (err) throw err;
                        console.log('Plain File deleted!');
                    });
                });
            });

        });

    } else if (req.url == '/shareFile') {
        console.log("\nINSIDE SHARE FILE FUNCTION")
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            var owner = fields.email;
            var filename = fields.filetoshare;
            var persontoshare = fields.persontoshare;
            var username = fields.username;
            var persontoshareemail;
            console.log("Owner:", owner);
            console.log("Filename:", filename);
            console.log("PersonToShareWith:", persontoshare);
            console.log("Username: ", username)
            var emailPresent = " "

            MongoClient.connect(url, {
                useNewUrlParser: true
            }, function (err, db) {
                if (err) throw err;

                var dbo = db.db("EFSDB");
                dbo.collection("users").findOne({
                    username: persontoshare
                }, function (err, result) {
                    if (err) throw err;

                    if (result === null) {
                        emailPresent = "false"
                    } else {
                        emailPresent = "true"
                        console.log("result: ", result._id)
                        persontoshareemail = result._id
                    }
                    db.close();
                });

                var myquery = {
                    username: persontoshare
                };
                var newvalues = {
                    $push: {
                        filesSharedWithMe: {
                            filename,
                            username
                        },
                    }
                };

                dbo.collection("users").updateOne(myquery, newvalues, function (err, res) {
                    if (err) throw err;
                    if (emailPresent == "true") {
                        console.log('1 file added to filesSharedDB');
                    } else if (emailPresent == "false") {
                        console.log(persontoshare, "is not present in database.")
                    } else {
                        console.log("Message not updated for console.")
                    }
                    db.close();
                });

                dbo.collection("users").findOne({
                    _id: owner
                }, function (err, result) {
                    if (err) throw err;

                    if (result._id == owner) {

                        fs.readFile('./html/home.html', function (err, data) {
                            res.writeHead(200, {
                                'Content-Type': 'text/html'
                            });
                            res.write(data);

                            // Adding contents to Homepage from MongoDB database 3 - on file share
                            res.write('<input type="hidden" name="email" value="' + owner + '">');
                            res.write('<input type="hidden" name="username" value="' + username + '">');
                            res.write('</form>');
                            res.write('<h3>Files Owned</h3>');
                            res.write('<form action="./downloadFile" method="post" enctype="multipart/form-data">');
                            res.write('<input type="hidden" name="email" value="' + owner + '">');
                            res.write('<input type="hidden" name="username" value="' + username + '">');
                            if (result.filesOwned != undefined) {
                                for (var i = 0; i < result.filesOwned.length; i++) {
                                    filename = result.filesOwned[i];
                                    res.write('<input type="submit" name="filename" value="' + filename + '"/>');
                                    res.write('<br><br>');
                                }
                            } else {
                                res.write('<h4>No files uploaded...</h1>');
                            }
                            res.write('</form>');

                            res.write('<h3>Files Sharing</h3>');
                            res.write('<br>');
                            res.write('<form action="./shareFile" method="post" enctype="multipart/form-data">');
                            if (result.filesOwned != undefined) {
                                res.write('<input type="hidden" name="email" value="' + owner + '">');
                                res.write('<input type="hidden" name="username" value="' + username + '">');
                                res.write('<h4>Enter File to Share</h4>');
                                res.write('<select name="filetoshare">');
                                for (var i = 0; i < result.filesOwned.length; i++) {
                                    res.write('<option value="' + result.filesOwned[i] + '">' + result.filesOwned[i] + '</option>');
                                }
                                res.write('</select>');
                                res.write('<br>');
                                res.write('<br>');
                                res.write('<input type="text" name="persontoshare" placeholder="Enter username">');
                                res.write('<br>');
                                res.write('<br>');
                                res.write('<input type="submit" >');
                            } else {
                                res.write('<h4>No files available to share<h5>');
                            }
                            res.write('</form>');

                            res.write('<h3>Files Shared With Me</h3>');
                            res.write('<form action="./downloadSharedFile" method="post" enctype="multipart/form-data">');
                            if (result.filesSharedWithMe != undefined) {
                                for (var i = 0; i < result.filesSharedWithMe.length; i++) {
                                    filename = result.filesSharedWithMe[i].filename;
                                    res.write('<input type="submit" name="filename" value="' + filename + ' : ' + result.filesSharedWithMe[i].username + '"/>');
                                    res.write('<br><br>');
                                }

                            } else {
                                res.write('<h4>No files shared with me...</h1>');
                            }
                            res.write('</form>');

                            res.write('<script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>');
                            res.write('<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>');
                            res.write('<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>');
                            res.write('</body>');
                            if (emailPresent == "true") {
                                res.write('<div class="alert alert-success alert-dismissible fade show" role="alert" style="margin-left:20px ; margin-right: 20px;">');
                                res.write('File Shared Successfully');
                                res.write('<button type="button" class="close" data-dismiss="alert" aria-label="Close">');
                                res.write('<span aria-hidden="true">&times;</span>');
                                res.write('</button>');
                                res.write('</div>');
                                // res.write('<div style="position: fixed; top:58%;left: 37.4%; width: 25.3%; text-align: center;color: green;">');
                                // res.write('Logged in Successfully');
                                // res.write('</div>');
                            } else if (emailPresent == "false") {
                                res.write('<div class="alert alert-danger alert-dismissible fade show" role="alert" style="margin-left:20px ; margin-right: 20px;">');
                                res.write('User does not exist');
                                res.write('<button type="button" class="close" data-dismiss="alert" aria-label="Close">');
                                res.write('<span aria-hidden="true">&times;</span>');
                                res.write('</button>');
                                res.write('</div>');
                                // res.write('<div style="position: fixed; top:58%;left: 37.4%; width: 25.3%; text-align: center;color: green;">');
                                // res.write('Logged in Successfully');
                                // res.write('</div>');
                            } else {
                                res.write('<div class="alert alert-dark alert-dismissible fade show" role="alert" style="margin-left:20px ; margin-right: 20px;">');
                                res.write('Message not updates');
                                res.write('<button type="button" class="close" data-dismiss="alert" aria-label="Close">');
                                res.write('<span aria-hidden="true">&times;</span>');
                                res.write('</button>');
                                res.write('</div>');
                                // res.write('<div style="position: fixed; top:58%;left: 37.4%; width: 25.3%; text-align: center;color: green;">');
                                // res.write('Logged in Successfully');
                                // res.write('</div>');
                            }
                            res.write('</html>');
                            res.end();
                            console.log("MAIL")
                            console.log("filename:", filename)
                            console.log("to:  ", persontoshareemail)
                            var subjectString = 'Encrypted File Shared: ' + filename
                            // var textString = username + " has shared the following file with you: \n\n\t" + filename
                            var textString =
                                '<div style="background-color: #f5f5f5; height: 250px;">' +
                                '<br>' +
                                '<div style="background-color: white; width: 50%; height: 70%; margin-left: 25%;">' +
                                '<br>' +
                                '<div style="margin-left: 40px; font-size: 14px; font-family: Roboto,Arial,Helvetica,sans-serif;">' +
                                username +
                                ' has shared the following file with you:' +
                                '<div style="height:10px;"></div>' +
                                '<div style="color: #3367d6;">' +
                                '<img src="https://ci3.googleusercontent.com/proxy/KkPZvlt9m9e38cWfvEtnFKeyJmjZzCkO-FneMDIpKASHkA0qTAPekqlBK_54oykI_w7Z1oBnHvu0hSqX_TzplZ5maS4bFN1J037Ij1egyURyGQ-dkTSCYtPfufRG7w=s0-d-e1-ft#https://ssl.gstatic.com/docs/documents/share/images/services/document-4.png"' +
                                'aria-label="Document" style="vertical-align:middle;max-width:24px" data-image-whitelisted=""' +
                                'class="CToWUd">' +
                                filename +
                                '<div style="height:24px;"></div>' +
                                '<a href="https://www.google.com/" style=" background-color:#4d90fe;border:1px solid' +
                                '#3079ed;border-radius:2px;color:white;display:inline-block;font:bold 11px' +
                                'Roboto,Arial,Helvetica,sans-serif;height:19px;min-width:54px;outline:0px;padding:0' +
                                '8px;text-align:center;text-decoration:none" target="_blank"' +
                                'data-saferedirecturl="https://www.google.com/url?q=https://docs.google.com/document/d/1WAyK3oyBQ409uvlSikO4U0tp9ge6FicFMza-u08QVPg/edit?usp%3Dsharing_eip%26ts%3D5e8caadf&amp;source=gmail&amp;ust=1586780322557000&amp;usg=AFQjCNGoEEpucUfZDcfLjZlOyWBoOsHbvA">Open</a>' +
                                '</div>' +
                                '</div>' +
                                '</div>' +
                                '</div>'
                            var mailOptions = {
                                from: 'encryptedfilesystem@gmail.com',
                                to: persontoshareemail,
                                subject: subjectString,
                                html: textString
                            };

                            var transporter = nodemailer.createTransport({
                                service: 'gmail',
                                auth: {
                                    user: 'encryptedfilesystem@gmail.com',
                                    pass: 'a1b2c3d4!!'
                                }
                            });

                            transporter.sendMail(mailOptions, function (error, info) {
                                if (error) {
                                    console.log("Error while sending email");
                                } else {
                                    console.log('Email sent Successfully');
                                }
                            });
                        });
                    }
                    db.close();
                });
            });
        });

    } else if (req.url == '/downloadSharedFile') {
        console.log("\nINSIDE DOWNLOAD SHARED FILE FUNCTION")
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            var file = fields.filename;
            var filename = file.split(' : ')[0];
            var username = file.split(' : ')[1];
            var filenameFH = filename.split('.')[0];
            var filenameSH = filename.split('.')[1]
            var extension = filenameSH.split(':')[0];
            console.log("username:", username);
            console.log("filename:", filename);
            console.log("filenameFH:", filenameFH);
            console.log("extension:", extension);
            var filepath = './storage/' + username + '/' + filenameFH + '.dat';
            console.log("Filepath:", filepath);
            var newfilepath = './storage/' + username + '/' + filename;
            console.log("NewFilePath:", newfilepath);
            encryptor.decryptFile(filepath, newfilepath, key, function (err) {
                fs.readFile(newfilepath, function (err, data) {
                    res.writeHead(200, {
                        'Content-Disposition': 'attachment;filename=' + filename
                    });
                    res.write(data);
                    res.end();
                    fs.unlink(newfilepath, function (err) {
                        if (err) throw err;
                        console.log('Plain File deleted!');
                    });
                });
            });

        });
    }
}).listen(8080);