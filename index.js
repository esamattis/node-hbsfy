/*jshint node: true*/

var through = require('through');
var Handlebars = require("handlebars");

var extensions = {
  hbs: 1,
  handlebar: 1
};

function hbsfy(file) {
  if (!extensions[file.split(".").pop()]) return through();

  var buffer = "";

  return through(function(chunk) {
    buffer += chunk.toString();
  },
  function() {
    var js = Handlebars.precompile(buffer);
    // Compile only with the runtime dependency.
    var compiled = "// hbsfy compiled Handlebars template\n";
    compiled += "var Handlebars = require('hbsfy/runtime');\n";
    compiled += "module.exports = Handlebars.template(" + js.toString() + ");\n";
    this.queue(compiled);
    this.queue(null);
  });

};

hbsfy.configure = function(opts) {
  if (!opts || !opts.extensions) return hbsfy;
  extensions = {};
  opts.extensions.forEach(function(ext) {
    extensions[ext] = 1;
  });
  return hbsfy;
};

module.exports = hbsfy;

