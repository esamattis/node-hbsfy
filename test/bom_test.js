
var assert = require("assert");
var concat = require("concat-stream");
var fs = require("fs");
var hbsfy = require("hbsfy");

var templatePath = __dirname + "/bom.hbs";
var reBOM = /^\uFEFF/;

// Ensure our fixture actually contains a BOM
fs.createReadStream(templatePath)
.pipe(concat(function(data) {
  assert(
    reBOM.test(data.toString()),
    "The template should contain a bom"
  );
}));

fs.createReadStream(templatePath)
.pipe(hbsfy(templatePath))
.pipe(concat(function(data) {
  assert(
    reBOM.test(data.toString()) === false,
    "The template should not contain a bom"
  );
}));