import React from "react";

type ViewProps = {
  spacing?: number;
};

type ViewState = {};

class DepictionSpacerView extends React.Component<ViewProps, ViewState> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return <div className="DepictionSpacerView" style={{ minHeight: this.props.spacing ? `${this.props.spacing}px`: undefined}}></div>;
  }
}

export default DepictionSpacerView;

