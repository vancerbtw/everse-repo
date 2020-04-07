import React from "react";

type ViewProps = {
  title: string;
  useBoldText?: Boolean;
  useMargins?: Boolean;
  alignment?: number;
};

type ViewState = {};

class DepictionSubheaderView extends React.Component<ViewProps, ViewState> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return <div className="DepictionSubheaderView" style={{ 
      fontWeight: this.props.useBoldText ? "bold": undefined, 
      marginTop: this.props.useMargins ? 0: undefined,
      marginBottom: this.props.useMargins ? 0: undefined
    }}>{this.props.title}</div>;
  }
}

export default DepictionSubheaderView;

