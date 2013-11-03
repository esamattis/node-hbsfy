
var assert = require("assert");
var concat = require("concat-stream");
var fs = require("fs");
var hbsfy = require("hbsfy").configure({
  extensions: ["html"]
});

var templatePath = __dirname + "/custom.html";

fs.createReadStream(templatePath)
.pipe(hbsfy(templatePath))
.pipe(concat(function(data) {
  assert(
    /hbsfy compiled Handlebars template/.test(data.toString()),
    "The template should be compiled"
  );
}));


