
# hbsfy

[Handlebars][] precompiler plugin for [Browserify v2][].

Compiles Handlebars templates to plain Javascript. The compiled templates
depend only on [handlebars-runtime][] so they are lightweight fast!

## Usage

Install hbsfy locally to your project:

    npm install hbsfy

Handlebars runtime will be automatically installed as [peer dependency][].

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

[Handlebars]: http://handlebarsjs.com/
[Browserify v2]: https://github.com/substack/node-browserify
[handlebars-runtime]: https://npmjs.org/package/handlebars-runtime
[peer dependency]: http://blog.nodejs.org/2013/02/07/peer-dependencies/
