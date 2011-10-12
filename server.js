
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

  function notFound() {
    res.statusCode = 404;
    res.end("404 Not Found\n")
  }

  function error(err) {
    res.statusCode = 500;
    res.end(err.message + "\n");
  }

  exists(path, function(exists){
    if (!exists) return notFound()
    fs.stat(path, function(err, stat){
      if (err) return error();
      if (stat.isDirectory()) path += '/index.html';
      res.setHeader('Cache-Control', 'no-cache');
      fs.createReadStream(path).pipe(res);
    });
  })
}).listen(port)

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");