
/**
 * Module dependencies.
 */

var http = require('http')
  , url = require('url')
  , join = require('path').join
  , exists = require('path').exists
  , fs = require('fs')
  , port = process.argv[2] || 8003;

http.createServer(function(req, res){
  var pathname = url.parse(req.url).pathname
    , path = join(process.cwd(), pathname);

  var respondWith404 = function () {
    res.writeHead(404, {"Content-Type": "text/plain"})
    res.write("404 Not Found\n")
    res.end()
  }

  var respondWith500 = function (err) {
    res.writeHead(500, {"Content-Type": "text/plain"})
    res.write(err + "\n")
    res.end()
  }

  exists(path, function(exists){
    if (!exists) return respondWith404()
    fs.stat(path, function(err, stat){
      if (err) return respondWith500();
      if (stat.isDirectory()) path += '/index.html';
      res.setHeader('Cache-Control', 'no-cache');
      fs.createReadStream(path).pipe(res);
    });
  })
}).listen(port)

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");