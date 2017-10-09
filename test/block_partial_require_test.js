var concat = require("concat-stream");
var browserify = require("browserify");
var assert = require("assert");
var vm = require("vm");

var b = browserify(__dirname + "/blockPartialBrowserCode.js");
b.transform(require("hbsfy"), { traverse: true });

var context = {
  document: {
    body: {}
  }
};

b.bundle().pipe(concat(function(data) {
  var bundle = data.toString();
  assert(/require\('.\/block_partial_required\.hbs'\)/.test(bundle), 'looking for require');
  assert(/block_partial_required.hbs['"]\:/.test(bundle), 'looking for included partial');
  assert(/var partial\$0/.test(bundle), 'looking for partial temp var');
  assert(/, partial\$0/.test(bundle), 'looking for partial registration');
  vm.runInNewContext(bundle, context);
}));

setTimeout(function() {
  assert.equal(context.document.body.innerHTML.trim(), "<div><p>inside</p></div>");
}, 400);
