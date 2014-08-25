
var hbsfy = require("hbsfy");
var concat = require("concat-stream");
var assert = require("assert");
var fs = require("fs");
var templatePath = __dirname + "/custom_pre_compiler.hbs";

// Subargs are just passed as the second argument
// https://github.com/substack/node-browserify/blob/5cbf55a4397f300df69be574b59f3f30ac01b9c2/bin/advanced.txt#L81-L90
fs.createReadStream(templatePath)
.pipe(hbsfy(templatePath, { compiler: "Ember.Handlebars" }))
.pipe(concat(function(data) {
  assert(
    /hbsfy compiled Handlebars template/.test(data.toString()),
    "The template should be compiled"
  );
  assert(
    /Ember.Handlebars/.test(data.toString()),
    "compiled should have compiler set"
  );
}));


