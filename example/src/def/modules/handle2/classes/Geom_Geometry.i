%nodefaultctor Geom_Geometry;
class Handle_Geom_Geometry : public MMgt_TShared {
	public:
  %feature("compactdefaultargs") Translated;
  //const Handle_Geom_Geometry Translated(const gp_Vec & V);
    %extend {
      const Handle_Geom_Geometry Translated(const gp_Vec & V) {
        return (*$self)->Translated(V);
      }
    }

};
