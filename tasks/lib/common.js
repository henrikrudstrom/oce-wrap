function moduleTask(name, mName) {
  if (Array.isArray(mName)) {
    return mName.map((m) => moduleTask(name, m));
  }
  if (Array.isArray(name)) {
    return name.map((n) => moduleTask(n, mName));
  }
  return name + ':' + mName;
}

module.exports.moduleTask = moduleTask;
