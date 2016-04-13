var Handlebars = require("hbsfy/runtime");

var template = require("./inline_partial_require.hbs");

document.body.innerHTML = template();
