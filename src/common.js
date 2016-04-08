var replaceAll = function(target, search, replacement) {
  return target.split(search).join(replacement);
};

function match(exp, name) {
  exp = new RegExp('^' + replaceAll(exp, '*', '.*') + '$');
  return exp.test(name);
}

function find(data, expr, matcher) {
  var type = expr;
  var member = null;
  if (expr.indexOf('::') !== -1) {
    type = expr.split('::')[0];
    member = expr.split('::')[1];
  }
  var types = data.declarations.filter(matcher(type));
  if (member === null) return types;
  return types.map((t) => t.declarations)
    .reduce((a, b) => a.concat(b), [])
    .filter(matcher(member));
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
  get: getDecl
};
