# hbsfy [![Build Status][travis-badge]][travis]

[Handlebars][handlebars] precompiler plugin for [Browserify][browserify] without magic.

Compiles Handlebars templates to plain Javascript. The compiled templates only
have one copy of the Handlebars runtime so they are lightweight and fast!

## Usage

Install hbsfy locally to your project:

```no-highlight
npm install hbsfy --save-dev
```

Handlebars will be automatically installed as a [peer dependency][peer-dep].

Then use it as Browserify transform module with `-t`:

```no-highlight
browserify -t hbsfy main.js > bundle.js
```

where `main.js` can be like:

```javascript
var template = require("./template.hbs");
document.body.innerHTML = template({ name: "Epeli" });
```

and `template.hbs`:

```hbs
<h1>Hello {{name}}!</h1>
```

### Specifying Options

By default hbsfy uses the `package.json` in your project to set configuration options.

```json
{
  "name": "my-project",
  "browserify": {
    "transform": ["hbsfy"]
  },
  "hbsfy": {
    "extensions": ["html"],
    "precompiler": "precompiler-module-name",
    "compiler": "require('my-compiler') or window.compiler"
  }
}
```

All options are optional. By default `precompiler` is just `handlebars`, and `compiler` is `require('hbsfy/runtime')` which is just Handlebars.Runtime.
These options will be used by normal usage, as well as programmatic usage. Using `hbsfy.configure` (see below) will override these options.

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


[travis]: https://travis-ci.org/epeli/node-hbsfy
[travis-badge]: https://travis-ci.org/epeli/node-hbsfy.svg?branch=master
[handlebars]: http://handlebarsjs.com/
[browserify]: https://github.com/substack/node-browserify
[peer-dep]: http://blog.nodejs.org/2013/02/07/peer-dependencies/
