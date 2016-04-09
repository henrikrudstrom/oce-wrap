var replaceAll = function(target, search, replacement) {
  return target.split(search).join(replacement);
};

function match(exp, name) {
  exp = new RegExp('^' + replaceAll(exp, '*', '.*') + '$');
  return exp.test(name);
}

function find(data, expr, matcher) {
  //console.log(expr)
  var res = expr.match(
    /((?:\w|\*)+)(?:::((?:\w|\*)+))*(?:\(((?:\w|\*)+)(?:, *((?:\w|\*)+))*\))*/
  );

  var type = res[1];
  var member = res[2];
  var args = null;
  if (expr.indexOf('(') !== -1)
    args = res.slice(3).filter((a) => a !== undefined);

    
  var types = data.declarations.filter(matcher(type));
  if (member === undefined) return types;
  return types.map((t) => t.declarations)
    .reduce((a, b) => a.concat(b), [])
    .filter(matcher(member, args));
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
