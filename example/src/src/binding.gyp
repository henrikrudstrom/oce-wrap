{
  "targets": [{
    "target_name":"tesselator",
    "sources": ["Tesselator.cpp", "tesselator_wrap.cxx"],
    "include_dirs": ["/home/henrik/OCE/include/oce", "/home/henrik/Development/oce-wrap/example/src/src/"],
    "libraries": [
      "-L/home/henrik/OCE/lib",
      "-lTKernel",
      "-lTKMath",
      "-lTKG3d",
      "-lTKBRep",
      "-lTKTopAlgo"
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
