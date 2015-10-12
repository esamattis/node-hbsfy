/*jshint node: true*/

var through = require("through");
var xtend = require("xtend");

var defaultPrecompiler = require("handlebars");
var defaultCompiler = "require('hbsfy/runtime')";
var defaultTraverse = false;
var defaultExtensions = {
  hbs: true,
  handlebar: true,
  handlebars: true
};

function findPartials(tree) {
  var partials = [];
  hbTraverse(tree, function(node) {
    // handlebars 3,4
    if (node.type === 'PartialStatement') {
      partials.push(node.name.original);
      return
    }
    // handlebars 2
    if (node.type === 'partial') {
      partials.push(node.partialName.name);
      return;
    }
  });
  return partials;
}

function hbTraverse(node, action) {
  if (Array.isArray(node)) {
    return node.forEach(function(v) {
      hbTraverse(v, action);
    });
  }
  if (node && typeof node === 'object') {
    action(node);
    return Object.keys(node).forEach(function(k) {
      hbTraverse(node[k], action);
    })
  }
}

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
  var traverse = defaultTraverse;

  opts = opts || {};

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

    if (opts.t || opts.traverse) {
      traverse = opts.t || opts.traverse;
    }
  }

  if (!extensions[file.split(".").pop()]) return through();

  var buffer = "";

  return through(function(chunk) {
    buffer += chunk.toString();
  },
  function() {
    var js;
    var compiled = "// hbsfy compiled Handlebars template\n";
    var parsed = null;
    var partials = null;

    // Kill BOM
    buffer = buffer.replace(/^\uFEFF/, '');

    try {
      if (traverse) {
        parsed = precompiler.parse(buffer);
        partials = findPartials(parsed);
      }

      js = precompiler.precompile(buffer, opts.precompilerOptions);
    } catch (e) {
      this.emit('error', e);
      return this.queue(null);
    }

    // Compile only with the runtime dependency.
    compiled += "var HandlebarsCompiler = " + compiler + ";\n";

    if (partials && partials.length) {
      partials.forEach(function(p, i) {
        var ident = "partial$" + i;
        compiled += "var " + ident + " = require('" + p + "');\n";
        compiled += "HandlebarsCompiler.registerPartial('" + p + "', " + ident + ");\n";
      });
    }

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

