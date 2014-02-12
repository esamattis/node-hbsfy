[![Build Status](https://travis-ci.org/epeli/node-hbsfy.png?branch=master)](https://travis-ci.org/epeli/node-hbsfy)

# hbsfy

[Handlebars][] precompiler plugin for [Browserify][] without magic.

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

### Use in gulp

You can easily use hbsfy in [gulp][] with [gulp-browserify][]:

```javascript
gulp.task('js', function() {
  gulp.src('js/app.js')
    .pipe(browserify({
      insertGlobals: true,
      transform: ['hbsfy']
    }))
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./public/js'));
});
```

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


[Handlebars]: http://handlebarsjs.com/
[Browserify]: https://github.com/substack/node-browserify
[peer dependency]: http://blog.nodejs.org/2013/02/07/peer-dependencies/
[gulp]: http://gulpjs.com/
[gulp-browserify]: https://github.com/deepak1556/gulp-browserify
