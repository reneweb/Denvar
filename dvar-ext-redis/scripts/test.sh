#!/bin/bash

./node_modules/.bin/mocha --recursive &&
./node_modules/.bin/eslint .
