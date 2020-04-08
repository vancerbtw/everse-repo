import React from "react";

type ViewProps = {
  URL: string;
  width: number;
  height: number;
  borderRadius?: number;
  alignment?: number;
};

type ViewState = {};

class DepictionImageView extends React.Component<ViewProps, ViewState> {
  constructor(props: any) {
    super(props);
  }

  render() {
    console.log(this.props.alignment);
    return (
      <div className="DepictionImageView" style={{
        textAlign: this.props.alignment == 1 ? "center": this.props.alignment == 2 ? "right": undefined
      }}>
        <img src={this.props.URL} style={{
          width: this.props.width,
          height: this.props.height,
          borderRadius: this.props.borderRadius ? this.props.borderRadius + "px": undefined
        }} />
      </div>
    );
  }
}

export default DepictionImageView;

