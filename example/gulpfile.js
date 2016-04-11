const settings = require('../src/settings.js');
settings.initialize();
require('../src/tasks/main.js');


`swig -javascript -node -c++ -DSWIG_TYPE_TABLE=occ.js -w302,401,314,509,512+ -DCSFDB -DHAVE_CONFIG_H -DOCC_CONVERT_SIGNALS\
 -I/usr/include/node -I/home/henrik/OCE/include/oce -o tesselator.cxx tesselator.i`
