var notWorking = {
};

module.exports.notWorking = function(clsName, memberSig) {
  if (clsName in notWorking)
    return notWorking[clsName].find(s => s === memberSig);
  return false;
};

var returnType = {
};
module.exports.returnType = function(clsName, memberSig) {
  if (clsName in returnType) {
    var sigs = returnType[clsName];
    if (memberSig in sigs) {
      return sigs[memberSig];
    }
  }
  return false;
};
