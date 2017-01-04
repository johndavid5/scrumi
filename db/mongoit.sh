#!/bin/bash
set -x
# mongo diana/scrumi < $1 2>&1 | tee $1.out
mongo localhost/scrumi < $1 2>&1 | tee $1.out
set +x
