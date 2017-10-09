var Handlebars = require("hbsfy/runtime");

var template = require("./block_partial_require.hbs");

document.body.innerHTML = template();
