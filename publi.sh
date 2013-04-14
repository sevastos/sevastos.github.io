#!/bin/bash

#currBranch=`git branch --no-color | sed -e '/^[^*]/d' -e 's/* \(.*\)/\1/'`
currBranch=`git rev-parse --abbrev-ref HEAD`

rm -rf out/*

# Publish source
git push -n public $currBranch:source -f

# Generate docpad files
docpad generate --env static
cp CNAME out/CNAME
cp README out/README
cd out
git init
git remote add public git@github.com:sevastos/sevastos.github.com.git

# Publish generated files
git add .
echo "Type the commit message of the publish repo: "
read commit_msg
if [[ -z "${commit_msg}" ]]; then
	commit_msg = "Generated"
fi
git commit -m "Pub: $commit_msg" # Concat unpublish commit messages OR ask user
git push -n public master:master

# Erase last commit (Docpad Generation)
#git reset --hard HEAD~1

cd ..
#rm -rf out/*
