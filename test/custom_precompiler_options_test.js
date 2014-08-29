var hbsfy        = require("hbsfy");
var concat       = require("concat-stream");
var assert       = require("assert");
var fs           = require("fs");
var templatePath = __dirname + "/hello.hbs";

//let's not miss a lib change :o
fs.createReadStream(templatePath)
  .pipe(hbsfy(templatePath))
  .pipe(concat(function(data) {
    assert(
      /helperMissing\.call/.test(data.toString()),
      "The helperMissing call is present"
    );
  }));

//actually check that the options were sent
//knownHelpers => all the helperMissing stuff shouldn't be here
fs.createReadStream(templatePath)
  .pipe(hbsfy(templatePath, {
    precompilerOptions: {
      knownHelpers: {
        'upcase': true
      },
      knownHelpersOnly: true
    }
  }))
  .pipe(concat(function(data) {
    assert(
      !/helperMissing\.call/.test(data.toString()),
      "The helperMissing call should not be present"
    );
  }));
