[![Build Status](https://travis-ci.org/epeli/node-hbsfy.png?branch=master)](https://travis-ci.org/epeli/node-hbsfy)

# hbsfy

[Handlebars][] precompiler plugin for [Browserify v2][] without magic.

Compiles Handlebars templates to plain Javascript. The compiled templates only
have one copy of the Handlebars runtime so they are lightweight and fast!

## Usage

Install hbsfy locally to your project:

    npm install hbsfy

Handlebars will be automatically installed as [peer dependency][].

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

### 1.0.0

  - Remove `handlebars-runtime` dependency and dependency directly on
    `handlebars` module as [peer dependency][].
  - Runtime must be now required with `require("hbsfy/runtime")` instead of
    `require("handlebars-runtime")`.
  - Thanks to @kamicane for teaching me how to do this.

## Browserify?

<https://github.com/substack/node-browserify>

Further reading: <http://esa-matti.suuronen.org/blog/2013/03/22/journey-from-requirejs-to-browserify/>

[Handlebars]: http://handlebarsjs.com/
[Browserify v2]: https://github.com/substack/node-browserify
[peer dependency]: http://blog.nodejs.org/2013/02/07/peer-dependencies/
