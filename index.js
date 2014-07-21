/*jshint node: true*/

var through = require("through");
var Handlebars = require("handlebars");

var defaultExtensions = {
  hbs: true,
  handlebar: true,
  handlebars: true
};

function hbsfy(file, opts) {
  var extensions = defaultExtensions;

  if (opts && opts.extensions) {
    extensions = {};
    if (typeof opts.extensions === "string") {
      opts.extensions.split(",").filter(Boolean).forEach(function(ext) {
        extensions[ext] = true;
      });
    }
    else {
      extensions = opts.extensions;
    }
  }


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

}

hbsfy.configure = function(opts) {
  if (!opts || !opts.extensions) return hbsfy;
  defaultExtensions = {};
  opts.extensions.forEach(function(ext) {
    defaultExtensions[ext] = 1;
  });
  return hbsfy;
};

module.exports = hbsfy;

