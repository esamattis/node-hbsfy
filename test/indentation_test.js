/*jshint node: true*/

var fs = require("fs");
var assert = require("assert");

var hbsfy = require("hbsfy");
var Handlebars = require("hbsfy/runtime");


var templatePath = __dirname + "/indentation.hbs";
var exported = __dirname + "/compiled.js";

try {
  fs.unlinkSync(exported);
} catch (err) { }

fs.createReadStream(templatePath)
.pipe(hbsfy(templatePath, {
  processContent: function(content) {
    return content
      .replace(/^[\x20\t]+/mg, '')
      .replace(/[\x20\t]+$/mg, '')
      .replace(/[\r\n]/g, '');
  }
}))
.pipe(fs.createWriteStream(exported))
.on("close", function() {
  var template = require(exported);
  var res = template({ name: "Bob" });
  assert.equal(res, "<header><h1>Hi Bob!</h1></header>");
});

