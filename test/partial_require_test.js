
var concat = require("concat-stream");
var browserify = require("browserify");
var assert = require("assert");
var vm = require("vm");

var b = browserify(__dirname + "/partial_require.hbs");
b.transform(require("hbsfy"), { traverse: true });

b.bundle().pipe(concat(function(data) {
  var bundle = data.toString();
  assert(/require\('.\/partial_required\.hbs'\)/.test(bundle), 'looking for require');
  assert(/partial_required.hbs['"]\:/.test(bundle), 'looking for included partial');
  assert(/var partial\$0/.test(bundle), 'looking for partial temp var');
  assert(/, partial\$0/.test(bundle), 'looking for partial registration');
}));
