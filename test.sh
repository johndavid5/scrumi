set -x
./node_modules/.bin/mocha --reporter spec 2>&1 | tee test.out
set +x
