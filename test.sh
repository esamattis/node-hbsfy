#!/bin/sh

set -eu

cd test/
npm link hbsfy
node test.js
node browserify_test.js
node custom_extension_test.js

