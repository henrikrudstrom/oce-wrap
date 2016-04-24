[![Code Climate](https://codeclimate.com/github/henrikrudstrom/oce-wrap/badges/gpa.svg)](https://codeclimate.com/github/henrikrudstrom/oce-wrap)
#Open Cascade wrap generator for node.js
work in progress:

##dependencies:
* node.js
* python 2.x
* gccxml or castxml
* pygccxml
* swig 3.x (latest from git)
* OCE 0.16 (not tested on 0.17)

##installation
1. install dependencies
2.
```
npm install -g gulp
npm install
```

3. Edit settings.js and example/settings.js
Set paths to OCE headers and
If you have castxml (ubuntu 15.0) use these settings:
```
  "xmlGenerator":  "castxml",
  "xmlGeneratorPath": "/usr/bin/castxml"
```
With gccxml:
```
  "xmlGenerator":  "gccxml",
  "xmlGeneratorPath": "/usr/bin/gccxml"
```

##Test it:
```
cd example
gulp init
gulp build
gulp test
```
##Goal
Create a lightweight unopinionated wrapper for core modelling functionality of open cascade.


TODOS:

Eliminate handles
all collection classes as js lists
convert one shot classes to static functions
strip away as many internal classes as possible.
