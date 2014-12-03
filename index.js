/*jshint node: true*/

var through = require("through");
var xtend = require("xtend");

var defaultPrecompiler = require("handlebars");
var defaultCompiler = "require('hbsfy/runtime')";
var defaultExtensions = {
  hbs: true,
  handlebar: true,
  handlebars: true
};


// Convert string or array of extensions to an object
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
  var compiler = defaultCompiler;
  var precompiler = defaultPrecompiler;

  if (opts) {
    if (opts.e || opts.extensions) {
      extensions = toExtensionsOb(opts.e || opts.extensions);
    }

    if (opts.p || opts.precompiler) {
      precompiler = require(opts.p || opts.precompiler);
    }

    if (opts.c || opts.compiler) {
      compiler = opts.c || opts.compiler;
    }
  }

  if (!extensions[file.split(".").pop()]) return through();

  var buffer = "";

  return through(function(chunk) {
    buffer += chunk.toString();
  },
  function() {
    var js;
    try {
      js = precompiler.precompile(buffer, opts && opts.precompilerOptions);
    } catch (e) {
      this.emit('error', e);
      return this.queue(null);
    }
    // Compile only with the runtime dependency.
    var compiled = "// hbsfy compiled Handlebars template\n";
    compiled += "var HandlebarsCompiler = " + compiler + ";\n";
    compiled += "module.exports = HandlebarsCompiler.template(" + js.toString() + ");\n";
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

