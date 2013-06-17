/*jshint node: true*/

var through = require('through');
var Handlebars = require("handlebars");

module.exports = function(file) {
  if (!/\.hbs|\.handlebars/.test(file)) return through();

  var buffer = "";

  return through(function(chunk) {
    buffer += chunk.toString();
  },
  function() {
    var js = Handlebars.precompile(buffer);
    // Compile only with the runtime dependency.
    var compiled = "var Handlebars = require('handlebars-runtime');\n";
    compiled += "module.exports = Handlebars.template(" + js.toString() + ");\n";
    this.queue(compiled);
    this.queue(null);
  });

};

