#!/bin/sh
( grunt database | node index.js | node_modules/bunyan/bin/bunyan ) &