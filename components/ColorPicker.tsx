import React from "react";
import { SketchPicker } from "react-color";

class ColorPicker extends React.Component {
  props: {
    color?: string,
    onChange?: (e: string) => any,
    onClose?: (e: any) => any,
    style?: any
  } = this.props;

  state: {
    color: string,
    presets: string[],
    tempColor: string
  }

  constructor(props: any) {
    super(props);
    this.state = {
      color: this.props.color || "#607D8B",
      tempColor: this.props.color || "#607D8B",
      presets: ["#f44336", "#e91e63", "#9c27b0", "#6c65c8", "#673ab7", "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4", "#2cb1be", "#009688", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722", "#795548", "#607d8b"]
    };
  }

  onChange(color: string) {
    this.setState({ color: color });
    if (this.props.onChange) this.props.onChange(color);
  }

  render() {
    return (
      <div style={{ position: "absolute", ...(this.props.style || {}), zIndex: 110 }}>
        <div onClick={this.props.onClose} style={{ zIndex: 100, position: "fixed", width: 100000, height: 100000, left: -50000, top: -50000, backgroundColor: "rgba(0,0,0,0.5)", cursor: "default" }} />
        <div style={{ zIndex: 100, position: "relative", cursor: "default" }}>
          <SketchPicker color={this.state.tempColor} onChange={e => this.setState({ tempColor: e.hex })} onChangeComplete={e => this.onChange(e.hex)} presetColors={this.state.presets} disableAlpha={true} />
        </div>
      </div>
    );
  }
}

export default ColorPicker;