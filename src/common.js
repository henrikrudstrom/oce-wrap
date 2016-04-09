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

function keyMatcher(exp, args, matchValue) {
  if (matchValue === undefined)
    matchValue = true;

  return function(obj) {
    var key = obj.key;
    if (exp.indexOf('(') === -1)
      key = key.split('(')[0];

    return match(exp, key) ? matchValue : !matchValue;
  };
}
function find(data, expr) {
  var type = expr;
  var member = undefined;
  if (expr.indexOf('::')) {
    type = expr.split('::')[0];
    member = expr.split('::')[1];
  }
  var types = data.declarations.filter(keyMatcher(type));
  if (member === undefined) return types;
  return types.map((t) => t.declarations)
    .reduce((a, b) => a.concat(b), [])
    .filter(keyMatcher(member));
}

function getDecl(data, name, matcher) {
  var res = find(data, name, matcher);
  if (res.length === 0) return null;
  if (res.length === 1) return res[0];
  throw new Error('headers.get expected one result, got multiple');
}

module.exports = {
  match,
  find,
  get: getDecl,
  matcher: keyMatcher
};
