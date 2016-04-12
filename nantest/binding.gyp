{
  "targets": [{
    "target_name":"gp",
    "sources": ["Point3Wrap.cc"],
    "include_dirs": ["/home/henrik/OCE/include/oce",
    "<!(node -e \"require('nan')\")",
    "/home/henrik/Development/oce-wrap/nantest"],
    "libraries": [
      "-L/home/henrik/OCE/lib",
      "-lTKernel",
      "-lTKMath"
    ],
    "cflags": [
      "-DCSFDB", "-DHAVE_CONFIG_H", "-DOCC_CONVERT_SIGNALS",
      "-D_OCC64", "-Dgp_EXPORTS", "-Os", "-DNDEBUG", "-fPIC",
      "-fpermissive",
      "-DSWIG_TYPE_TABLE=occ.js"
    ],
    "cflags!": ["-fno-exceptions"],
    "cflags_cc!": ["-fno-exceptions"]
  }]
}
