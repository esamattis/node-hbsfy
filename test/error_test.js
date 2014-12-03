
var fs = require("fs");
var hbsfy = require("hbsfy");

var templatePath = __dirname + "/error.hbs";

fs.createReadStream(templatePath)
.pipe(hbsfy(templatePath))
.on('error', function () {
  // Error handled, so we will not crash.
});

