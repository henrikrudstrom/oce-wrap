%nodefaultctor Geom_Axis1Placement;
class Handle_Geom_Axis1Placement : public Handle_Geom_AxisPlacement {
	public:
  %extend {
    %feature("compactdefaultargs") Geom_Axis1Placement;
    Handle_Geom_Axis1Placement(const gp_Pnt & P, const gp_Dir & V) : Handle_Geom_Axis1Placement(new Geom_Axis1Placement(P, V)){

    }
        /*const Standard_Real Angle(const Handle_Geom_AxisPlacement & Other) {
          return (*$self)->Angle(Other);
        }*/
    /*const Handle_Geom_Axis1Placement Reversed(){
      return (*$self)->Reversed();
    }*/
        const Handle_Geom_Axis1Placement Reversed(){
          return ((Geom_Axis1Placement*)($self)->Access())->Reversed();
        }
  }
};
