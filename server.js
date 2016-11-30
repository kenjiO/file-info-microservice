var express = require('express');
var path = require('path');
var busboy = require("connect-busboy");

var app = express();
app.use(busboy());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res, next) {
  res.render('index');
});

// Used code from http://stackoverflow.com/a/27967263
app.post("/", function(req, res) {
    if(req.busboy) {
        req.busboy.on("file", function(fieldName, fileStream, fileName, encoding, mimeType) {
            var byteCount = 0;
            fileStream.on('data', (chunk) => {
              byteCount += chunk.length;
            });
            fileStream.on('end', (x) => {
              res.json({"size": byteCount});
            });
        });
        return req.pipe(req.busboy);
    }
    //Something went wrong -- busboy was not loaded
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  //res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.locals.error =  err ;

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Express server listening on port ", port);
});
