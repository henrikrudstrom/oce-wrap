import os
import json
from glob import glob
import parse
import re
import sys
from pygccxml import declarations
from collections import OrderedDict

#oce_include = "/home/henrik/OCE/include/oce"

from collections import OrderedDict
import json



def ignore(header):
    header = os.path.splitext(header)[0]
    header = re.sub("<\w+>", "", header)
    header = header.replace(oce_include + "/", "")
    if header in ignore_list["headers"]:
        return True

    if header.split("_")[0] in ignore_list["modules"]:
        return True


    return False


class Dict(OrderedDict):
    pass

class Module:

    def __init__(self, name, output_path):
        self.name = name
        self.output_path = output_path
        self.files = glob(oce_include + "/" + name + "*.hxx")
        self.files = filter(lambda h: not ignore(h), self.files)

        self.ns = parse.parse_files(oce_include, self.files)
        #print "===================loaded"

#json.dumps(classes[1], cls=ComplexEncoder)




def iter(decls, func):
    return [func(decl) for decl in list(decls)]


def select_module(module, name):
    if name.startswith(module):
        return True
    if name.startswith("Handle_" + module):
        return True

    return False

def add_if(d, value, name):
    if(value):
        d[name] = value
def clean_name(name):
    if name.startswith("::"):
        return name[2:];
    return name

def type(t):
    # if isinstance(t, declarations.cpptypes.declarated_t):
    #     return str(t)
    # if isinstance(t, declarations.cpptypes.void_t):
    #     return str(t)
    if(hasattr(t, 'base')):
        return type(t.base)
    return str(t);

def with_parent(parent, fn):
    def f(obj):
        return fn(obj, parent)
    return f

def include_member(member):
    if(member.access_type != "public"):
        return False;
    if(isinstance(member, declarations.constructor_t)):
        if member.parent.is_abstract:
            return False
    return True;

def w_arg(arg):
    tp = str(arg.type)
    if("const" in tp):
        tp = "const " + tp.replace(" const", "") #consts are on the wrong side for some reason
    d = Dict(name=arg.name, type=clean_name(type(arg.type)), decl=tp)
    add_if(d, arg.default_value, "default")
    return d

def w_member_function(cd, parent):
    args = list(iter(cd.arguments, w_arg))
    d = Dict(
        name=clean_name(cd.name),
        key=cd.name + "(" + ", ".join([a['type'] for a in args]) + ")",
        parent=parent.name,
        cls="memfun",
        arguments=args,
        returnType=str(cd.return_type) if cd.return_type else ""

        )
    add_if(d, cd.has_static, "static")
    add_if(d, cd.has_extern, "extern")
    add_if(d, cd.has_const, "const")
    add_if(d, cd.is_artificial, "artificial")
    add_if(d, cd.does_throw, "throws") #TODO
    add_if(d, cd.exceptions, "exceptions") #TODO
    add_if(d, cd.virtuality.replace("not virtual", ""), "virtuality")
    return d

def w_constructor(cc, parent):
    member = w_member_function(cc, parent)
    member['cls']="constructor"
    add_if(member, cc.is_copy_constructor, "copyConstructor")
    #member["trivialConstructor"] = cc.is_trivial_constructor
    return member

def w_enum(e):
    return Dict(
        name=clean_name(e.name),
        cls="enum",
        key=clean_name(e.name),
        values=e.values)

def w_typedef(td):
    return Dict(name=clean_name(td.name), type=str(td.type), key=clean_name(td.name), cls="typedef")



def s_class(module):
    def select(obj):
        return select_module(module, obj.name) and not ignore(obj.name)
    return select
    #return lambda obj:

def s_typedef(module):
    return lambda obj: select_module(module, obj.name) and not ignore(obj.name)

def s_enum(module):
    return lambda obj: select_module(module, obj.name) and not ignore(obj.name)


def w_base(info):
    d = Dict(
    name=info.related_class.name,
    access=info.access,
    )
    add_if(d, info.is_virtual, "virtual")
    return d


def w_class(cls):
    return Dict(name=cls.name,
        bases=[w_base(b) for b in cls.bases],
        abstract=cls.is_abstract,
        artificial=cls.is_artificial,
        location=cls.location.as_tuple(),
        cls="class",
        key=cls.name,
        #operators=iter(cls.operators(), w_operator),
        # enums=iter(cls.enums(), w_enum),
        # #typedefs=iter(cls.typedefs(), w_typedef),
        #
        constructors=iter(cls.constructors(include_member, allow_empty=True), with_parent(cls, w_constructor)),
        members=iter(cls.member_functions(include_member, allow_empty=True), with_parent(cls, w_member_function)),

        #variables=iter(cls.variables(), w_variable)
        )

def w_module(ns, name):
    return Dict(
        name=name,
        classes=map(w_class, ns.classes(s_class(name), allow_empty=True)),
        typedefs=iter(ns.typedefs(s_typedef(name), allow_empty=True), w_typedef),
        enums=iter(ns.enums(s_enum(name), allow_empty=True), w_enum),
        headers=get_headers(name)
    )

def get_headers(name):
    headers =  [os.path.basename(p) for p in glob(oce_include + "/" + name +"_*.hxx")]
    headers = filter(lambda header: not ignore(header), headers)
    return headers


def wrapped_classes(module):
    def include(cls):
        if not (cls.name.startswith(module.name) or cls.name.startswith("Handle_" + module.name)):
            return False
        return True
    classes = list(module.ns.classes(include, allow_empty=True))

    return classes

if __name__ == "__main__":
    if len(sys.argv) > 1:
        module_name = sys.argv[1]
    if len(sys.argv) > 2:
        oce_include = sys.argv[2]
    if len(sys.argv) > 3:
        data_path = sys.argv[3]
    if len(sys.argv) > 4:
        output_path = sys.argv[4]
    else:
        exit(1)
    with open(data_path + "/cannot-parse.json", "r") as f:
        ignore_list = json.loads(f.read())
    module = Module(module_name, "")
    data = w_module(module.ns, module_name)

    classes = wrapped_classes(module)
    with open(output_path, "w") as f:
        f.write(json.dumps(data, sort_keys=False, indent=2))
