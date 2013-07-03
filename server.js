var http = require("http"),
    url = require("url"),
    fs = require("fs"),
    hw = require("./hardware");

function handleClear(request, response) {
    hw.clear();
    var result = {'result': 'ok', 'code': 200};
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.write(JSON.stringify(result));
    response.end();
}

function handleTravel(request, response) {
    var query = url.parse(request.url, true).query;
    hw.travel(query.destination, 100, function() {
        var result = {'result': 'ok', 'code': 200};
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.write(JSON.stringify(result));
        response.end();
    });
}

function handleModel(request, response) {
    var dests = hw.getDestinations();
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.write(JSON.stringify({'destinations': dests}));
    response.end();
}

function getMimeType(name) {
    var extension = name.split('.').pop();
    switch(extension) {
        case 'html':
            return 'text/html';
        case 'js':
            return 'text/javascript';
        case 'css':
            return 'text/css';
        default:
            return 'text/plain';
    }
}


function handleFile(request, response) {
    var pathname = url.parse(request.url).pathname;
    if (pathname === '/') {
        pathname = "/index.html";
    }

    pathname = "html" + pathname;
    fs.exists(pathname, function(exists) {
        if (exists) {
            response.writeHead(200, {'Content-Type': getMimeType(pathname)});
            fs.createReadStream(pathname).pipe(response);
        } else {
            response.writeHead(440, {'Content-Type': 'text/plain'});
            response.write('Error 440: File not found');
            response.end();
        }
    });
}


function start() {
    function onRequest(request, response) {
        var pathname = url.parse(request.url).pathname;

        var handler;
        switch(pathname) {
            case '/clear':
                handler = handleClear;
                break;
            case '/travel':
                handler = handleTravel;
                break;
            case '/model':
                handler = handleModel;
                break;
            default:
                handler = handleFile;
                break;
        }
        handler(request, response);
    }

    http.createServer(onRequest).listen(8888);
    console.log('server started');
}

exports.start = start;
