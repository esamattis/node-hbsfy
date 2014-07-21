/*jshint node: true*/

var through = require("through");
var Handlebars = require("handlebars");
var xtend = require("xtend");

var defaultExtensions = {
  hbs: true,
  handlebar: true,
  handlebars: true
};

// Convert string or array of extensions to a object
function toExtensionsOb(arr) {
  var ob = {};

  if (typeof arr === "string") {
    arr = arr.split(",");
  }

  if (Array.isArray(arr)) {
    arr.filter(Boolean).forEach(function(ext) {
      ob[ext] = true;
    });
  } else {
    // Already in the correct format
    return arr;
  }

  return ob;
}

function hbsfy(file, opts) {
  var extensions = defaultExtensions;

  if (opts && opts.e) {
    extensions = toExtensionsOb(opts.e);
  }

  if (opts && opts.extensions) {
    extensions = toExtensionsOb(opts.extensions);
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

// Return new hbsfy transform with custom default options
hbsfy.configure = function(rootOpts) {
  return function(file, opts) {
    return hbsfy(file, xtend({}, rootOpts, opts));
  };
};

module.exports = hbsfy;

