import React from "react";
import ReactDOM from "react-dom";

import { DraggableProvided, DraggableStateSnapshot } from "react-beautiful-dnd";

import DepictionMarkdownView from "./SileoViews/DepictionMarkdownView";
import DepictionHeaderView from "./SileoViews/DepictionHeaderView";
import DepictionScreenshotsView from "./SileoViews/DepictionScreenshotsView";
import DepictionImageView from "./SileoViews/DepictionImageView";
import DepictionSpacerView from "./SileoViews/DepictionSpacerView";
import DepictionTableTextView from "./SileoViews/DepictionTableTextView";
import DepictionTableButtonView from "./SileoViews/DepictionTableButtonView";
import DepictionSubheaderView from "./SileoViews/DepictionSubheaderView";

// const portal = document.createElement("div");
// document.body.appendChild(portal);

enum MarginsEnum {
  top,
  left,
  bottom,
  right
};

interface screenshot {
  url: string;
  accessibilityText: string;
  video: Boolean;
};

type rating = 0|1|2|3|4|5;

interface View {
  class: string;

  //headers
  title?: string;
  useMargins?: Boolean;
  useBottomMargin?: Boolean;
  useBoldText?: Boolean;
  alignment?: number;

  //labels
  text?: string;
  margins?: MarginsEnum;
  usePadding?: Boolean;
  fontWeight?: string;
  fontSize?: number;
  textColor?: string;

  //markdown
  markdown?: string;
  useSpacing?: Boolean;
  useRawFormat?: Boolean;
  tintColor?: string;

  //Images
  URL?: string;
  width?: number;
  height?: number;
  cornerRadius?: number;
  horizontalPadding?: number;

  //Screenshots
  screenshots?: screenshot[];
  itemCornerRadius?: number;
  itemSize?: string;

  //Table Button
  action?: string;
  backupAction?: string;
  openExternal?: number;
  yPadding?: number;

  spacing?: number;

  //ratings
  rating?: rating;

  //Reviews
  author?: string;
};

type ViewProps = {
  view: View,
  showScreenshots: Function
};

type ViewState = {
  config: { tabs?: [] }
};

class ViewLoader extends React.Component<ViewProps, ViewState> {
  constructor(props: ViewProps) {
    super(props);
  }

  render() {
    let child = <div></div>;

    switch (this.props.view.class) {
      case "DepictionHeaderView":
        child = <DepictionHeaderView title={this.props.view.title || ""} useBoldText={this.props.view.useBoldText} />;

      case "DepictionMarkdownView": 
        child = <DepictionMarkdownView markdown={this.props.view.markdown || ""} />;
    
      case "DepictionScreenshotsView":
        child = <DepictionScreenshotsView itemCornerRadius={this.props.view.itemCornerRadius || 0} screenshots={this.props.view.screenshots || []} itemSize={this.props.view.itemSize || ""} showScreenshots={this.props.showScreenshots}></DepictionScreenshotsView>
      
      case "DepictionImageView":
        child = <DepictionImageView URL={this.props.view.URL || ""} width={this.props.view.width || 0} height={this.props.view.height || 0} alignment={this.props.view.alignment} />

      case "DepictionSpacerView":
        child = <DepictionSpacerView spacing={this.props.view.spacing} />

      case "DepictionSeparatorView":
        child = <div className="DepictionSeparatorView"></div>

      case "DepictionTableTextView":
        child = <DepictionTableTextView title={this.props.view.title || ""} text={this.props.view.text || ""} />

      case "DepictionTableButtonView":
        child = <DepictionTableButtonView title={this.props.view.title} action={this.props.view.action} tintColor={this.props.view.tintColor} />

      case "DepictionSubheaderView":
        child = <DepictionSubheaderView title={this.props.view.title || ""} useBoldText={this.props.view.useBoldText} useMargins={this.props.view.useMargins}/>

      default:
        break;
    }

    return child;
  }
}

export default ViewLoader;

