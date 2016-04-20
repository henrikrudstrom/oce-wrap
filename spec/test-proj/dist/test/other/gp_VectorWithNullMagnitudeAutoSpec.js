var other = require('../../lib/other.node');
var create = require('../create.js')
describe('other.gp_VectorWithNullMagnitude', function(){


  it('gp_VectorWithNullMagnitude()', function(){
    // console.log('gp_VectorWithNullMagnitude()')
    var res = new other.gp_VectorWithNullMagnitude();
    var res_h = res._handle;
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_VectorWithNullMagnitude');
  });


  // arguments or return type not wrapped
  xit('gp_VectorWithNullMagnitude(Standard_CString)', function(){
    // console.log('gp_VectorWithNullMagnitude(Standard_CString)')
    var res = new other.gp_VectorWithNullMagnitude(create.Standard_CString());
    var res_h = res._handle;
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_VectorWithNullMagnitude');
  });



  // arguments or return type not wrapped
  xit('raise(Standard_CString)', function(){
    // console.log('raise(Standard_CString)')
    var obj = create.other.gp_VectorWithNullMagnitude();
    var res = obj.raise(create.Standard_CString());
  });


  // arguments or return type not wrapped
  xit('raise(Standard_SStream)', function(){
    // console.log('raise(Standard_SStream)')
    var obj = create.other.gp_VectorWithNullMagnitude();
    var res = obj.raise(create.Standard_SStream());
  });


  // arguments or return type not wrapped
  xit('newInstance(Standard_CString)', function(){
    // console.log('newInstance(Standard_CString)')
    var obj = create.other.gp_VectorWithNullMagnitude();
    var res = obj.newInstance(create.Standard_CString());
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('Handle_gp_VectorWithNullMagnitude');
  });


  // arguments or return type not wrapped
  xit('dynamicType()', function(){
    // console.log('dynamicType()')
    var obj = create.other.gp_VectorWithNullMagnitude();
    var res = obj.dynamicType();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('Handle_Standard_Type');
  });

});
