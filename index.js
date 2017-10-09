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
var defaultProcessContent = function(content) {
  return content;
}

var MARKER = "// hbsfy compiled Handlebars template\n";

var inlinePartials = {};

function findPartials(tree) {
  var partials = [];
  hbTraverse(tree, function(node) {
    // handlebars 3,4
    if ((node.type === 'PartialStatement' || node.type === 'PartialBlockStatement') && node.name.original.substr(0,1) !== "@" && !inlinePartials[node.name.original]) {
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
  if (node && node.type == 'DecoratorBlock' && node.path.original == 'inline') {
    inlinePartials[node.params[0].original] = true;
  }
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

function getOptions(opts) {
  var extensions = defaultExtensions;
  var compiler = defaultCompiler;
  var precompiler = defaultPrecompiler;
  var traverse = defaultTraverse;
  var processContent = defaultProcessContent;

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

    if (opts.pc || opts.processContent) {
      processContent = opts.pc || opts.processContent;
    }
  }

  return xtend({}, opts, {
    extensions: extensions,
    precompiler: precompiler,
    compiler: compiler,
    traverse: traverse,
    processContent: processContent
  });
}

function compile(file, opts) {
  var options = getOptions(opts);
  var compiler = options.compiler;
  var precompiler = options.precompiler;
  var traverse = options.traverse;
  var processContent = options.processContent;

  var js;
  var compiled = MARKER;
  var parsed = null;
  var partials = null;

  // Kill BOM
  file = file.replace(/^\uFEFF/, '');
  file = processContent(file);

  if (traverse) {
    parsed = precompiler.parse(file);
    partials = findPartials(parsed);
  }

  js = precompiler.precompile(file, options.precompilerOptions);

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

  return compiled;
}

function hbsfy(file, opts) {
  var extensions = getOptions(opts).extensions;

  if (!extensions[file.split(".").pop()]) return through();

  var buffer = "";

  return through(function(chunk) {
    buffer += chunk.toString();
  },
  function() {

    // Pass through if already compiled.
    if (buffer.indexOf(MARKER) > -1) {
      this.queue(buffer);
      this.queue(null);
      return;
    }

    var compiled;

    try {
      compiled = compile(buffer, opts);
    } catch (e) {
      this.emit('error', e);
      return this.queue(null);
    }

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

exports = module.exports = hbsfy;
exports.findPartials = findPartials;
exports.compile = compile;
