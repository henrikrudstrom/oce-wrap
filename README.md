




##Tasks
###1. init
Initialize project: parse headers to json and caches them in `paths.cache`, 
only needs to be run once.
###2. configure
Processes the module configuration defined in `paths.modules` and generates
a json datastructure representing the target wrapper as a json written to `paths.config`
###3. generate
Creates the source distribution for the wrapper:
Render swig/js files, create .cxx files from swig, render specs/tests, collect user files
###4. build
Compiles wrapper
###5. dist
Collect 
               
