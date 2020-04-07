import React from "react";

type ViewProps = {
  text: string;
  fontWeight?: string;
  usePadding?: Boolean;
  textColor?: string;
  fontSize?: number;
};

type ViewState = {
  
};

class DepictionLabelView extends React.Component<ViewProps, ViewState> {
  constructor(props: any) {
    super(props);
  }
  

  render() {
    
    const fontWeights = {
      "black": "1000",
      "heavy": "800",
      "bold": "bold",
      "semibold": "600",
      "regular": "regular",
      "thin": "200",
      "ultralight": "100"
    };

    return <div className="DepictionLabelView" style={{
      fontWeight: fontWeights[this.props.fontWeight || "normal"],
      paddingTop: this.props.usePadding ? "12px": undefined,
      paddingBottom: this.props.usePadding ? "12px": undefined,
      color: this.props.textColor ? this.props.textColor: undefined,
      fontSize: this.props.fontSize ? this.props.fontSize + "pt": undefined
    }}>{this.props.text}</div>;
  }
}

export default DepictionLabelView;

