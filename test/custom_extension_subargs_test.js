
var hbsfy = require("hbsfy");
var concat = require("concat-stream");
var assert = require("assert");

// Subargs are just passed as the second argument
// https://github.com/substack/node-browserify/blob/5cbf55a4397f300df69be574b59f3f30ac01b9c2/bin/advanced.txt#L81-L90
var tr = hbsfy("foo.html", { extensions: "html" });

tr.pipe(concat(function(data) {
  assert(
    /hbsfy compiled Handlebars template/.test(data.toString()),
    "File was compiled"
  );

}));

tr.write("hello {{bar}}");
tr.end();
