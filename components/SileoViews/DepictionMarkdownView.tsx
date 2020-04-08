import React from "react";
import MarkdownView from 'react-showdown';

type ViewProps = {
  markdown: string;
};

type ViewState = {
  
};

class DepictionMarkdownView extends React.Component<ViewProps, ViewState> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <div className="DepictionMarkdownView">
        <MarkdownView markdown={this.props.markdown}/>
      </div>
    );
  }
}

export default DepictionMarkdownView;

