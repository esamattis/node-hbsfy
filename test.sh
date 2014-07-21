#!/bin/sh

set -eu
set -x

# Make require("hbsfy") work
if [ ! -h node_modules/hbsfy ]; then
    rm -rf node_modules/hbsfy
    ln -fs .. node_modules/hbsfy
fi

cd test/

for test_file in *test.js
do
    node "$test_file"
done

