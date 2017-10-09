[![Build Status](https://travis-ci.org/epeli/node-hbsfy.png?branch=master)](https://travis-ci.org/epeli/node-hbsfy)

# hbsfy

[Handlebars][] precompiler plugin for [Browserify][] without magic.

Compiles Handlebars templates to plain Javascript. The compiled templates only
have one copy of the Handlebars runtime so they are lightweight and fast!

## Usage

Install hbsfy locally to your project:

    npm install --save-dev hbsfy

You will also need Handlebars installed. Handlebars 1, 2, 3, and 4 are supported
for now (use 4 for best results):

    npm install --save-dev handlebars

Then use it as Browserify transform module with `-t`:

    browserify -t hbsfy main.js > bundle.js

where main.js can be like:

```javascript
var template = require("./template.hbs");
document.body.innerHTML = template({ name: "Epeli" });
```

and template.hbs:

```html
<h1>Hello {{name}}!</h1>
```

## Options

### Custom Extension

You can use `--extensions` or `-e` subarg option to configure custom extensions
for the transform:

    browserify -t [ hbsfy -e html,htm ] main.js > bundle.js

### Alternate Precompiler/Compiler

You can specify how the templates are precompiled by using `-p` or `--precompiler`, which
might also be used with the `-c` or `--compiler` option, like so:

    browserify -t [ hbsfy -p ember-template-compiler -c Ember.Handlebars ] main.js > bundle.js

By default the precompiler is the [handlebars](https://www.npmjs.org/package/handlebars) node module
and the compiler is `"require('hbsfy/runtime')"`.

Options for the precompiler can be passed using a `precompilerOptions` key.

Example:

Enable `myUltimateHelper` only

    browserify -t [ hbsfy --precompilerOptions [ --knownHelpersOnly --knownHelpers [ --myUltimateHelper ] ] ]  main.js > bundle.js

See [Handlebars API reference](http://handlebarsjs.com/reference.html) for
details.

### Common JS Partial Resolution

Using the `--traverse` or `-t` option will cause partials to be resolved using node's [module resolution algorithm](https://nodejs.org/docs/latest/api/modules.html#modules_all_together). Be sure to prefix relative paths with `./` or `../` as needed. Otherwise the algorithm assumes a `node_module` is being referenced.

Example:

    browserify -t [ hbsfy -t ] main.js > bundle.js

```html
<!-- main.hbs -->
<div>{{> ./path/to/partial.hbs }}</div>
```

```html
<!-- path/to/partial.hbs -->
<p>I'm a partial</p>
```

## Inline Partials

If you are using Common JS partial resolution (setting the `--traverse` flag) and you are using Handlebars 4.0.0 or later, you can still use inline partials. Make sure to not use inline partial names that conflict with `node_module` dependencies. The inline partial will be used over a dependency reference.


## package.json

Transform can be configured from the package.json too.

```json
{
  "browserify": {
    "transform": [
      [
        "hbsfy",
        {
          "extensions": [
            "html"
          ],
          "precompilerOptions": {
            "knownHelpersOnly": true,
            "knownHelpers": {
              "myUltimateHelper": true
            }
          }
        }
      ]
    ]
  }
}
```

The `precompiler` and `compiler` keys are naturally available too.

See [module-deps
documentation](https://github.com/substack/module-deps#packagejson-transformkey)
for more information as this feature is implemented there (it's a part of
Browserify itself).

## Programmatic usage

The `configure` method of the transform can be used to create new transforms
with different defaults.

```javascript
var hbsfy = require("hbsfy").configure({
  extensions: ["html"]
});

var browserify = require("browserify");
var b = browserify("./index.js");
b.transform(hbsfy);
b.bundle().pipe(fs.createWriteStream("./bundle.js"));
```

### Helpers

To register custom helpers, require the runtime and run `registerHelper` to
create helper:

```javascript
var Handlebars = require("hbsfy/runtime");
Handlebars.registerHelper("upcase", function(s) {
  return s.toUpperCase();
});
```

### Partials

Partials can be created by giving precompiled template to the `registerPartial`
function.

```javascript
Handlebars.registerPartial('link', require("./partial.hbs"));
```

Checkout the example folder for details.

Note: if using the `--traverse` option, partial registration is automatic.

### .compile

This synchronous method can be used to enable all hsbfy functionality in another environment, such as node or a test runner (such as mocha).

```js
// mocha-hbs.js
var fs = require("fs");
var hbsfy = require("hbsfy");

require.extensions['.hbs'] = function (module, filename) {
  var file = fs.readFileSync(filename, "utf8");
  var opts = { traverse: true };
  return module._compile(hbsfy.compile(file, opts), filename);
}
```

```sh
$ mocha -r hbs:./mocha-hbs.js tests/
```

Remember to register your custom helpers as well! Ideally your templates themselves `require` your helpers and runtime, and call `registerHelper`. But if they don't, all helpers can be loaded at once as part of the require hook above:

```js
// mocha-hbs.js
var fs = require("fs");
var hbsfy = require("hbsfy");
var runtime = require("hbsfy/runtime");
var helpers = require("./path/to/my/exported/helpers");

Object.keys(helpers).forEach(function (key) {
  runtime.registerHelper(key, helpers[key]);
});

require.extensions['.hbs'] = function (module, filename) {
  var file = fs.readFileSync(filename, "utf8");
  var opts = { traverse: true };
  return module._compile(hbsfy.compile(file, opts), filename);
}
```

### Process output HTML string

This option accepts a function which takes one argument (the template file content) and returns a string which will be used as the source for the precompiled template object. The example below removes leading and trailing spaces to shorten templates.

```
hbsfy.configure({
  processContent: function(content) {
    content = content.replace(/^[\x20\t]+/mg, '').replace(/[\x20\t]+$/mg, '');
    content = content.replace(/^[\r\n]+/, '').replace(/[\r\n]*$/, '\n');
    return content;
  }
});
```

## Changelog

### 2.8.0

  - Support block partials, ignoring templates with `@` prefix. [#60](https://github.com/epeli/node-hbsfy/pull/60)

### 2.7.0

  - Allow inline partials when using `--traverse`. [#54](https://github.com/epeli/node-hbsfy/pull/54)

### 2.6.0

  - Add `processContent` option. [#50](https://github.com/epeli/node-hbsfy/pull/50)

### 2.5.0

  - Export `findPartials` and `compile` for use in utilities / test frameworks [#49](https://github.com/epeli/node-hbsfy/pull/49).

### 2.4.1

  - Always strip BOM [#18](https://github.com/epeli/node-hbsfy/pull/18), [#46](https://github.com/epeli/node-hbsfy/pull/46)

### 2.4.0

  - support handlebars 2, 3, 4

### 2.3.1

  - Handle `null` nodes when traversing Handlebars AST.

### 2.3.0

  - Allow resolving / requiring partials using node's module resolution algorithm (`--traverse`). [#47](https://github.com/epeli/node-hbsfy/pull/47)

### 2.2.1

  - Emit compile errors instead of crashing. [#38](https://github.com/epeli/node-hbsfy/pull/38)

### 2.2.0

  - Support for compiler options [#29](https://github.com/epeli/node-hbsfy/pull/29)

### 2.1.0

  - Subargs options for alternate precompilers and compilers [#31](https://github.com/epeli/node-hbsfy/pull/31)

### 2.0.0

  - Support Browserify [subargs](https://github.com/substack/node-browserify/blob/5cbf55a4397f300df69be574b59f3f30ac01b9c2/bin/advanced.txt#L81-L90)
  - The `configure` method does not mutate the inner state of the module
    anymore
    - Instead it returns a new transform function.
  - Handlebars is not a peerDependency anymore
    - It must be manually installed
    - This relaxes completely the version binding of Handlebars - it is now possible to try Handlebars 2.0 alpha

### 1.3.0

  - Support Handlebars 1.3
  - Now uses the official runtime api

### 1.0.0

  - Remove `handlebars-runtime` dependency and depend directly on
    the `handlebars` module as a [peer dependency][].
    - Runtime must be now required with `require("hbsfy/runtime")` instead of
      `require("handlebars-runtime")`.
    - Thanks to @kamicane for teaching me how to do this.
  - Option to configure template extensions


[Handlebars]: http://handlebarsjs.com/
[Browserify]: https://github.com/substack/node-browserify
[peer dependency]: http://blog.nodejs.org/2013/02/07/peer-dependencies/
