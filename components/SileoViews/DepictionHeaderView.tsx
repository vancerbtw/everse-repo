import React from "react";

type ViewProps = {
  title: string;
  useBoldText?: Boolean;
  useMargins?: Boolean;
  alignment?: number;
};

type ViewState = {};

class DepictionHeaderView extends React.Component<ViewProps, ViewState> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return <div className="DepictionHeaderView" style={{ 
      fontWeight: this.props.useBoldText ? "bold": undefined, 
      marginTop: this.props.useMargins ? 0: undefined,
      marginBottom: this.props.useMargins ? 0: undefined,
      textAlign: this.props.alignment == 1 ? "center": this.props.alignment == 2 ? "right" : undefined
    }}>{this.props.title}</div>;
  }
}

export default DepictionHeaderView;

