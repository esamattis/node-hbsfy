var hbsfy        = require("hbsfy");
var concat       = require("concat-stream");
var assert       = require("assert");
var fs           = require("fs");
var templatePath = __dirname + "/hello.hbs";

//let's not miss a lib change :o
fs.createReadStream(templatePath)
  .pipe(hbsfy(templatePath))
  .pipe(concat(function(data) {

    // module.exports = template
    eval(data);
    try {
      module.exports();
    } catch (e) {
      assert(e.message.indexOf('Missing helper') > -1, 'Missing helper error');
      assert(e.message.indexOf('upcase' > -1), 'missing helper is named');
    }
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

    // module.exports = template
    eval(data);
    try {
      module.exports();
    } catch (e) {
      assert.equal(e.message,
        'Cannot read property \'call\' of undefined');
    }
  }));
