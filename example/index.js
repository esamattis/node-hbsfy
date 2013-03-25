
var Handlebars = require("handlebars-runtime");
var template = require("./template.hbs");

Handlebars.registerHelper("upcase", function(s) {
  return s.toUpperCase();
});

window.onload = function() {
  document.body.innerHTML = template({ msg: "hello" });
}
