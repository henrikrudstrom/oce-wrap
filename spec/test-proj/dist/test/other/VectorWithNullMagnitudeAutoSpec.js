var other = require('../../lib/other.js');
var create = require('../create.js')
describe('other.VectorWithNullMagnitude', function(){


  it('VectorWithNullMagnitude()', function(){
    var res = new other.VectorWithNullMagnitude();
    var res_h = res._handle;
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('VectorWithNullMagnitude');
  });



    // arguments or return type not wrapped
  xit('dynamicType()', function(){
    var obj = create.other.VectorWithNullMagnitude();
    var res = obj.dynamicType();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('Handle_Standard_Type');
  });

});
