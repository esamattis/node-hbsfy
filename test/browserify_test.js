
var concat = require("concat-stream");
var browserify = require("browserify");
var assert = require("assert");
var vm = require("vm");

var b = browserify(__dirname + "/browsercode.js");
b.transform(require("hbsfy"));

// Browser mock
var context = {
  document: {
    body: {}
  }
};

b.bundle({ debug: false }).pipe(concat(function(data) {
  // Browserify is not respecting the `debug` flag, so source maps
  // are included, blowing up the size.
  var stripped = data.toString('utf8').replace(/\/\/# sourceMappingURL.+/g, '');
  assert(stripped.length < 35000, "Bundle is too big! Maybe full Handlebars got compiled in?");
  vm.runInNewContext(data.toString(), context);

}));

setTimeout(function() {
  assert.equal(context.document.body.innerHTML.trim(), "<h1>HELLO</h1>");
}, 400);

