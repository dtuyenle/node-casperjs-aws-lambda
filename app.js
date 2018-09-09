var express = require('express');
var bodyParser = require('body-parser');
var exec = require("child_process").exec;

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res) {
  exec("casperjs ./src/scripts/sample-script.js", (error, stdout, stderr) => {
    if ((error && error !== null)) {
      res.status(200).send(error + stderr);
    } else {
      var result = stdout.split('+++++++++++++++++++++++++++')[1];
      res.status(200).send(JSON.parse(result));
    }
  });
});

var server = app.listen(3005, function() {
  console.log('app running on', server.address().port);
});
