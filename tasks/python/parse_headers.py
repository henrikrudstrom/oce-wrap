import os
import json
from glob import glob

import re
import sys
from pygccxml import utils
from pygccxml import declarations
from pygccxml import parser
from collections import OrderedDict

from collections import OrderedDict


settings_path = 'settings.json'
xml_generator_path=None
xml_generator=None
if os.path.exists(settings_path):
    with open(settings_path, 'r') as f:
        settings = json.loads(f.read())
        xml_generator = settings.get('xmlGenerator')
        xml_generator_path = settings.get('xmlGeneratorPath')


def parse_files(path, files):
    # Find the location of the xml generator (castxml or gccxml)
    #generator_path, generator_name = utils.find_xml_generator()
    #print("GENER " + generator_path)
    # Configure the xml generator

    args = {
        'include_paths':[path],
        'keep_xml': True
        }
    if(xml_generator != None):
        args['xml_generator'] =xml_generator
    if(xml_generator_path != None):
        args['xml_generator_path'] =xml_generator_path

    xml_generator_config = parser.xml_generator_configuration_t(**args)

    def cache_file(filename):
        return parser.file_configuration_t(
            data=filename,
            content_type=parser.CONTENT_TYPE.CACHED_SOURCE_FILE,
            cached_source_file=filename.replace(path, "tmp/xml")+".xml")
    cached_files = [cache_file(f) for f in files]


    project_reader = parser.project_reader_t(xml_generator_config)
    decls = project_reader.read_files(
        cached_files,
        compilation_mode=parser.COMPILATION_MODE.ALL_AT_ONCE)

    return declarations.get_global_namespace(decls)



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

        self.ns = parse_files(oce_include, self.files)
        #print "===================loaded"

#json.dumps(classes[1], declType=ComplexEncoder)




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
        declType="memfun",
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
        declType="enum",
        key=clean_name(e.name),
        values=e.values)

def w_typedef(td):
    return Dict(name=clean_name(td.name), type=str(td.type), key=clean_name(td.name), declType="typedef")



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
    constructors=iter(cls.constructors(include_member, allow_empty=True), with_parent(cls, w_constructor))
    members=iter(cls.member_functions(include_member, allow_empty=True), with_parent(cls, w_member_function))
    return Dict(name=cls.name,
        bases=[w_base(b) for b in cls.bases],
        abstract=cls.is_abstract,
        artificial=cls.is_artificial,
        location=cls.location.as_tuple(),
        declType="class",
        key=cls.name,
        declarations=constructors + members
        #operators=iter(cls.operators(), w_operator),
        # enums=iter(cls.enums(), w_enum),
        # #typedefs=iter(cls.typedefs(), w_typedef),
        #


        #variables=iter(cls.variables(), w_variable)
        )

def w_module(ns, name):
    classes = map(w_class, ns.classes(s_class(name), allow_empty=True))
    typedefs = iter(ns.typedefs(s_typedef(name), allow_empty=True), w_typedef)
    enums = iter(ns.enums(s_enum(name), allow_empty=True), w_enum)
    
    return Dict(
        name=name,
        declarations= classes + typedefs + enums,
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
