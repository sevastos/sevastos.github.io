#!/bin/bash

#currBranch=`git branch --no-color | sed -e '/^[^*]/d' -e 's/* \(.*\)/\1/'`
currBranch=`git rev-parse --abbrev-ref HEAD`

# Publish source
git push -n public $currBranch:source

# Generate docpad files
docpad generate --env static

# Publish generated files
git commit -m "Generated"
git push -n public $currBranch:master

# Erase last commit (Docpad Generation)
git reset --hard HEAD~1
