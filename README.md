[![Build Status](https://travis-ci.org/epeli/node-hbsfy.png?branch=master)](https://travis-ci.org/epeli/node-hbsfy)

# hbsfy

[Handlebars][] precompiler plugin for [Browserify][] without magic.

Compiles Handlebars templates to plain Javascript. The compiled templates only
have one copy of the Handlebars runtime so they are lightweight and fast!

## Usage

Install hbsfy locally to your project:

    npm install hbsfy

You will also need Handlebars installed. Handlebars 1.x is officially supported
for now:

    npm install handlebars@1

Although the alpha version of Handlebars 2.0 should also work. Just drop the
`@1` to try it.

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

## Programmatic usage

When compiling using Javascript code custom extensions
can be set:

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

To register custom helpers just require the runtime use and `registerHelper` to
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


## Changelog

### 2.1.0

  - Subargs options for alternate precompilers and compilers [31](https://github.com/epeli/node-hbsfy/pull/31)

### 2.0.0

  - Support Browserify [subargs](https://github.com/substack/node-browserify/blob/5cbf55a4397f300df69be574b59f3f30ac01b9c2/bin/advanced.txt#L81-L90)
  - The `configure` method does not mutate the inner state of the  module
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
