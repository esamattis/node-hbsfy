
var assert = require("assert");
var concat = require("concat-stream");
var fs = require("fs");
var hbsfyBom = require("hbsfy");
var hbsfyNoBom = require("hbsfy").configure({
  bom: true
});

var templatePath = __dirname + "/bom.hbs";

fs.createReadStream(templatePath)
.pipe(hbsfyBom(templatePath))
.pipe(concat(function(data) {
  assert(
    /﻿/.test(data.toString()),
    "The template should contain a bom"
  );
}));

fs.createReadStream(templatePath)
.pipe(hbsfyNoBom(templatePath))
.pipe(concat(function(data) {
  assert(
    /﻿/.test(data.toString()) === false,
    "The template should not contain a bom"
  );
}));