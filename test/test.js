/*jshint node: true*/

var fs = require("fs");
var assert = require("assert");

var hbsfy = require("../index");

var templatePath = __dirname + "/hello.hbs";
var exported = __dirname + "/compiled.js";

try {
  fs.unlinkSync(exported);
} catch (err) { }

fs.createReadStream(templatePath)
.pipe(hbsfy(templatePath))
.pipe(fs.createWriteStream(exported))
.on("close", function() {
  var template = require(exported);
  var res = template({ msg: "Hi!" });
  assert.equal(res, "<h1>Hi!</h1>\n");
  console.log("ok");
});

