%nodefaultctor Geom_AxisPlacement;
class Handle_Geom_AxisPlacement : public Handle_Geom_Geometry {
	public:
  %feature("compactdefaultargs") Angle;
  //const Standard_Real Angle(const Handle_Geom_AxisPlacement & Other);
  %extend {
    const gp_Pnt Location(){
      return (*$self)->Location();
    }
    const Standard_Real angle(const Handle_Geom_AxisPlacement & Other) {
      return (*$self)->Angle(Other);
    }
  }
};
