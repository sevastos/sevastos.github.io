In a way to streamline the publishing of new content to [Github Pages][ghpages] while using a static site generator to fit my case, I ended up with the following setup.

Note that this repo is a User github page and not a Project github page, the [difference][ghpages-types] being that User pages are build from the `master` branch, while Projects from `gh-pages`.

Goals
=====
 1. Tidy branches for source viewing
 - Single action to publish both source and compiled data
 - Working github page with a custom domain :laughing:

Setup
=====
This repository has two branches:

 - `master` the compiled version of the site
 - `source` the source code before compilation

The `source` branch includes a shell script - ***[publi.sh][file:publi.sh]*** - that takes care of the "deployment".
What it does is pretty simple:

 - Cleans up and publishes the source to the `source` branch
 - Trigger the static site generation (to the output folder, in our case `/out`)
 - Copy additional files to the output folder (README and CNAME for the custom domain)
 - Then use the output folder as a new git repo, commit the data and push to the `master` branch that Github pages use

**Bonus Tip:**
Since we have to use the `master` branch for the output HTML and not the original source code, you could go to Github settings to set the default branch to `source`. Now when someone visits the github repo will see the proper source code and not the compiled version. (Of course this isn't needed on Project pages)

Thanks
======
- [Github Pages][ghpages] - free hosting service from Github
- [Docpad][docpad] - a static site generator for Node
- [Headtrackr][headtrackr] - awesome javascript tracker
- [Colorzilla][colorzilla] - CSS3 gradient generator

[ghpages]: http://pages.github.com/
[ghpages-types]: https://help.github.com/articles/user-organization-and-project-pages
[docpad]: https://github.com/bevry/docpad
[file:publi.sh]: publi.sh
[headtrackr]: https://github.com/auduno/headtrackr/
[colorzilla]: http://www.colorzilla.com/gradient-editor/