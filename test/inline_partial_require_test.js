
var concat = require("concat-stream");
var browserify = require("browserify");
var assert = require("assert");
var vm = require("vm");

var b = browserify(__dirname + "/inlinePartialBrowsercode.js");
b.transform(require("hbsfy"), { traverse: true });

var context = {
  document: {
    body: {}
  }
};

b.bundle().pipe(concat(function(data) {
  vm.runInNewContext(data.toString(), context);
}));

setTimeout(function() {
  assert.equal(context.document.body.innerHTML.trim(), "<p>Test</p>");
}, 400);
