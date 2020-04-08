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
  constructor(props: ViewProps) {
    super(props);
  }
  

  render() {
    
    const fontWeights = {
      black: 1000,
      heavy: 800,
      bold: "bold",
      semibold: 600,
      regular: "regular",
      thin: 200,
      ultralight: 100
    };

    return <div className="DepictionLabelView" style={{
      fontWeight: this.props.fontWeight === "black" ? 1000: this.props.fontWeight === "heavy" ? 800: this.props.fontWeight === "bold" ? "bold": this.props.fontWeight === "semibold" ? 600: this.props.fontWeight === "regular" ? "normal": this.props.fontWeight === "thin" ? 200: this.props.fontWeight === "ultralight" ? 100: "normal",
      paddingTop: this.props.usePadding ? "12px": undefined,
      paddingBottom: this.props.usePadding ? "12px": undefined,
      color: this.props.textColor ? this.props.textColor: undefined,
      fontSize: this.props.fontSize ? this.props.fontSize + "pt": undefined
    }}>{this.props.text}</div>;
  }
}

export default DepictionLabelView;

