// function renderIndexedMap(decl) {
//   var source = decl.source();
//
//   var src = `
// %typemap(argout) TopTools_IndexedMapOfShape& {// argoutout
//   v8::Local<v8::Array> array = v8::Array::New(v8::Isolate::GetCurrent(), $1->Extent());
//   for(int i = 1; i <= $1->Extent(); i++){
//     std::cout << "index" << i << "buckets" << $1->Extent();
//     array->Set(i-1, SWIG_NewPointerObj((const TopoDS_Shape*)&($1->FindKey(i)), SWIGTYPE_p_TopoDS_Shape, SWIG_POINTER_OWN |  0 ));
//   }
//   $result = array;
// }
//
// %typemap(in) TopTools_ListOfShape & {
//   // hello
//   TopTools_ListOfShape list();
//   v8::Handle<v8::Array> array = v8::Handle<v8::Array>::Cast($input);
//   int length = obj->Get(v8::String::New("length"))->ToObject()->Uint32Value();
//
//   void *argpointer;
//   for(int i = 1; i <= length; i++){
//     SWIG_ConvertPtr(array->Get(i), &argpointer, SWIGTYPE_p_TopoDS_Shape, 0);
//     list.Append((const TopoDS_Shape &)argpointer);
//   }
//
//   $1 = list;
// }
// `;
// }
