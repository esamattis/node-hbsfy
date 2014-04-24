/*jshint node: true*/
"use strict";

var through = require("through");
var precompiler = require("handlebars");
var compiler = "require('hbsfy/runtime')";
var mothership = require("mothership");

var extensions = {
  hbs: 1,
  handlebar: 1,
  handlebars: 1
};

// parse package.json options, stored in 'hbsfy' attribute.
parsePackageOptions();

function hbsfy(file) {
  if (!extensions[file.split(".").pop()]) return through();

  var buffer = "";

  return through(function(chunk) {
    buffer += chunk.toString();
  },
  function() {
    var js = precompiler.precompile(buffer);
    // Compile only with the runtime dependency.
    var compiled = "// hbsfy compiled Handlebars template\n";
    compiled += "var compiler = " + compiler + ";\n";
    compiled += "module.exports = compiler.template(" + js.toString() + ");\n";
    this.queue(compiled);
    this.queue(null);
  });
};

hbsfy.configure = function(opts) {
  if (!opts || !opts.extensions) return hbsfy;
  setOptions(opts);
  return hbsfy;
};

function parsePackageOptions() {
  var response = mothership.sync(process.cwd(), function (pack) {
    return !!pack.hbsfy;
  });

  if (response && response.pack.hbsfy) {
    setOptions(response.pack.hbsfy);
  }
}

function setOptions(options) {
  if (options.extensions && Array.isArray(options.extensions)) {
    extensions = {};
    options.extensions.forEach(function(ext) {
      extensions[ext] = 1;
    });
  }

  if (options.precompiler) {
    try {
      precompiler = require(options.precompiler);  
    } catch (e) {
      throw e;
    }
  }

  if (options.compiler) {
    compiler = options.compiler;
  }
}

module.exports = hbsfy;
