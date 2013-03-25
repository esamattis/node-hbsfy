
var Handlebars = require("handlebars-runtime");
var template = require("./template.hbs");

Handlebars.registerPartial('link', require("./partial.hbs"));

Handlebars.registerHelper("capitalize", function(name) {
  return name[0].toUpperCase() + name.slice(1);
});


var data = {
  name: "esa",
  links: [
    { name: "Blog", url: "http://esa-matti.suuronen.org/" },
    { name: "Twitter", url: "https://twitter.com/esamatti" },
    { name: "Github", url: "https://github.com/epeli" }
  ]
};

window.onload = function() {
  document.body.innerHTML = template(data);
};
