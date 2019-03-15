//To include a module, we use the require() function with the name of the module.
var http = require('http');

/*The HTTP module can create an HTTP server that listens to server ports and gives a response back to the client.
We use the createServer() method to create an HTTP server.
The function passed will be executed everytime someone tries to access the computer/server on port 8080[specified in listen()]
req -> obj that represents request from client
res -> onj that represents response to the client */
http.createServer(function (req, res) {
    /*The response from the HTTP server is supposed to be displayed as HTML,so we include an HTTP header with the correct content type.
    The 1st para is status code: 200 means OK, the second argument is an object containing the response headers.*/
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('Hello World!');
    //URL contains the part after the domain name ie /name in localhost:9000/summer or www.google.com/summer
    console.log(req.url);
    //console is used to debug the code
    console.log('hello');
}).listen(8080); 