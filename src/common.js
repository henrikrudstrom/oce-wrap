var replaceAll = function(target, search, replacement) {
  return target.split(search).join(replacement);
};

function match(exp, name) {
  exp = exp.replace('(', '\\(');
  exp = exp.replace(')', '\\)');
  exp = replaceAll(exp, '*', '.*');
  exp = new RegExp('^' + exp + '$');
  return exp.test(name);
}

function keyMatcher(exp, matchValue, wrapped) {
  if (typeof wrapped !== 'boolean' && typeof wrapped !== 'undefined')
    throw new Error();
  if (matchValue === undefined)
    matchValue = true;

  return function(obj) {
    var key = obj.key;
    if (wrapped !== undefined) {
      key = obj.name;
    }
    if (exp.indexOf('(') === -1 && key.indexOf('(') !== -1)
      key = key.split('(')[0];
    return match(exp, key) ? matchValue : !matchValue;
  };
}

function find(data, expr, wrapped) {
  var type = expr;
  var member = undefined;
  var splitter = '::';
  if (wrapped)
    splitter = '.';
  if (expr.indexOf(splitter)) {
    type = expr.split(splitter)[0];
    member = expr.split(splitter)[1];
  }

  var types = data.declarations.filter(keyMatcher(type, true, wrapped));
  if (member === undefined) return types;

  return types.map((t) => t.declarations)
    .reduce((a, b) => a.concat(b), [])
    .filter(keyMatcher(member, true, wrapped));
}

function getDecl(data, name, matcher) {
  var res = find(data, name, matcher);
  if (res.length === 0) return null;
  if (res.length === 1) return res[0];
  throw new Error('headers.get expected one result, got multiple');
}

function removePrefix(name) {
  var m = name.match(/^((?:Handle_)*)([a-z|A-Z|0-9]+_?)(\w*)$/);
  if (!m[3]) return name;
  return m[1] + m[3];
}

module.exports = {
  match,
  find,
  get: getDecl,
  matcher: keyMatcher,
  removePrefix
};
