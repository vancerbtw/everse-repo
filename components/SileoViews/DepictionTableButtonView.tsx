import React from "react";

type ViewProps = {
  action?: string;
  title?: string;
  tintColor?: string;
};

type ViewState = {};

class DepictionTableButtonView extends React.Component<ViewProps, ViewState> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return <div className="DepictionTableButtonView">
      <a href={this.props.action}>
        <div className="depictionButton" style={{color: this.props.tintColor ? this.props.tintColor: undefined, backgroundColor: this.props.tintColor ? this.props.tintColor: undefined}}>
          {this.props.title}
        </div>
        <div className="backwardsArrow"></div>
      </a>
    </div>;
  }
}

export default DepictionTableButtonView;

