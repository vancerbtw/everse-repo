import React from "react";
import DepictionMarkdownView from "./SileoViews/DepictionMarkdownView";
import DepictionHeaderView from "./SileoViews/DepictionHeaderView";
import DepictionScreenshotsView from "./SileoViews/DepictionScreenshotsView";
import DepictionImageView from "./SileoViews/DepictionImageView";
import DepictionSpacerView from "./SileoViews/DepictionSpacerView";
import DepictionTableTextView from "./SileoViews/DepictionTableTextView";
import DepictionTableButtonView from "./SileoViews/DepictionTableButtonView";
import DepictionSubheaderView from "./SileoViews/DepictionSubheaderView";

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
  constructor(props: any) {
    super(props);
  }

  render() {
    switch (this.props.view.class) {
      case "DepictionHeaderView":
        return <DepictionHeaderView title={this.props.view.title} useBoldText={this.props.view.useBoldText} />;

      case "DepictionMarkdownView": 
        return <DepictionMarkdownView markdown={this.props.view.markdown} />;
    
      case "DepictionScreenshotsView":
        return <DepictionScreenshotsView itemCornerRadius={this.props.view.itemCornerRadius} screenshots={this.props.view.screenshots} itemSize={this.props.view.itemSize} showScreenshots={this.props.showScreenshots}></DepictionScreenshotsView>
      
      case "DepictionImageView":
        return <DepictionImageView URL={this.props.view.URL} width={this.props.view.width} height={this.props.view.height} alignment={this.props.view.alignment} />

      case "DepictionSpacerView":
        return <DepictionSpacerView spacing={this.props.view.spacing} />

      case "DepictionSeparatorView":
        return <div className="DepictionSeparatorView"></div>

      case "DepictionTableTextView":
        return <DepictionTableTextView title={this.props.view.title} text={this.props.view.text} />

      case "DepictionTableButtonView":
        return <DepictionTableButtonView title={this.props.view.title} action={this.props.view.action} tintColor={this.props.view.tintColor} />

      case "DepictionSubheaderView":
        return <DepictionSubheaderView title={this.props.view.title} useBoldText={this.props.view.useBoldText} useMargins={this.props.view.useMargins}/>

      default:
        break;
    }

    return <div></div>
  }
}

export default ViewLoader;

