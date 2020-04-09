import React from "react";

type ViewProps = {
  title: string;
  text: string;
};

type ViewState = {};

class DepictionTableTextView extends React.Component<ViewProps, ViewState> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return <div className="DepictionTableTextView">
      <table className="depictionTable">
        <tbody>
          <tr>
            <td>{this.props.title}</td>
            <td>{this.props.text}</td>
          </tr>
        </tbody>
      </table>
    </div>;
  }
}

export default DepictionTableTextView;

