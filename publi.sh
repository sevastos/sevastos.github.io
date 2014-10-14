#!/bin/bash
exit 0
currBranch=`git rev-parse --abbrev-ref HEAD`

# Clean up previous generated site
rm -rf out

# Publish source
git push public $currBranch:source -f

last_commit_msg=`git log -1 --pretty=%B`

# [OUT]

# Generate docpad files
docpad generate --env static
cp CNAME out/CNAME
cp README.md out/README.md
cd out
git init
git remote add public git@github.com:sevastos/sevastos.github.io.git

# Publish generated files
git add .
echo "Type the commit message of the publish repo: "
read commit_msg
if [[ -z "${commit_msg}" ]]; then
	commit_msg="[a] ${last_commit_msg}"
fi
git commit -m "Pub: $commit_msg"
git push public master:master -f

# [/OUT]

# Cleanup
cd ..
rm -rf out

# Sync
git fetch public
git merge public/source
