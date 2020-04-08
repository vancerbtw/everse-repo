import React from "react";

interface screenshot {
  url: string;
}

type ViewProps = {
  itemCornerRadius: number;
  itemSize: string;
  screenshots: screenshot[];
  showScreenshots: Function;
};

type ViewState = {};

class DepictionScreenshotsView extends React.Component<ViewProps, ViewState> {
  constructor(props: any) {
    super(props);
  }

  render() {
    const screenshotCornerRadius = 8 || this.props.itemCornerRadius;
    const screenshotViewHeight = 400 || this.props.itemSize.substring(this.props.itemSize.lastIndexOf(",") + 1, this.props.itemSize.lastIndexOf("}"));

    return (
      <div className="DepictionScreenshotsView">
        { this.props.screenshots.map((screenshot, i) => {
          return (
            <img src={screenshot.url} style={{
              height: screenshotViewHeight + "px",
              borderRadius: screenshotCornerRadius + "px",
            }} className="screenshot" key={i} onClick={() => {
              this.props.showScreenshots(screenshot.url, screenshotCornerRadius + "px");
            }} />
          );
        }) }
      </div>
    );
  }
}

export default DepictionScreenshotsView;

