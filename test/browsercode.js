
var Handlebars = require("hbsfy/runtime");

Handlebars.registerHelper("upcase", function(s) {
  return s.toUpperCase();
});

var template = require("./hello.hbs");

document.body.innerHTML = template({
    msg: "hello"
});
