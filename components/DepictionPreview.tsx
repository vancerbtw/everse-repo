import React from "react";
import ViewLoader from "./ViewLoader";
import Head from 'next/head'

interface DepictionView {
  class: string;
  title: string;
};

interface DepictionTab {
  tabname: string;
  class: string;
  views: DepictionView[];
}

type DepictionProps = {
  depiction: depiction;
  data: {
    name: string;
    developer: string;
    icon: string | undefined;
    identifier: string;
  };
};

type depiction = { 
  class: string;
  headerImage?: string;
  tabs?: DepictionTab[];
}

type DepictionState = {
  config: depiction,
  tab: number,
  screenshot: string | undefined,
  borderRadius: string,
  icon: string,
  name: string,
  developer: string,
  identifier: string,
  user: { email: string, username: string, developer: Boolean } | undefined
};

export default class Preview extends React.Component<DepictionProps, DepictionState> {
  constructor(props: DepictionProps) {
    super(props);

    this.state = {
      config: this.props.depiction,
      tab: 0,
      screenshot: undefined,
      borderRadius: "8px",
      icon: this.props.data.icon || "",
      name: this.props.data.name,
      developer: this.props.data.developer,
      identifier: this.props.data.identifier,
      user: undefined
    };

    this.showScreenshots = this.showScreenshots.bind(this);
  }

  showScreenshots(url: string, borderRadius: string) {
    this.setState({
      screenshot: url,
      borderRadius
    });
  }
  
  render() {

    let screenshotViewer;

    if (this.state.screenshot) {
      screenshotViewer = (
        <div>
          <div className="screenshotBackground" onClick={() => {
            this.setState({
              screenshot: undefined
            });
          }}>

          </div>
          <div className="screenshotViewer" onClick={() => {
            this.setState({
              screenshot: undefined
            });
          }}>
            <img src={this.state.screenshot} className="viewerScreenshot" style={{
              borderRadius: this.state.borderRadius
            }}/>
          </div>
        </div>
      );
    }

    return (
      <div style={{height: "calc((100vh - 105px) - 50px)"}}>
        <Head>
          <title>test</title>
          <base target="_open"></base>
        </Head>
        <div id="everythingWrapper" className="wrapper">
          {screenshotViewer}
          <div id="bannerWrapper">
            <div id="bannerImage" style={{backgroundImage: `url(${this.state.config.headerImage})`}}></div>
            <div id="bannerNavItems">
                <div className="rightNavButton">
                    <div className="modifyButton"></div>
                </div>
            </div>
          </div>

          <div className="contentWrapper">
            <div className="headerSection">
              <div id="tweakIcon" style={{backgroundImage: this.state.icon ? `url(${this.state.icon})`: ""}}></div>
              <h1 id="tweakName">{this.state.name}</h1>
              <h4 id="developerName">{this.state.developer}</h4>
              <div className="priceButton">Free</div>
            </div>
            <div className="headerPillSelector">
              { this.state.config.tabs?.map((tab, i) => {
                return (
                  <div className="pillText" key={i} id={`${tab.tabname}Button`} onClick={() => {
                    this.setState({ tab: i });
                  }} style={{left: (50 / this.state.config?.tabs!.length || 0) * (2 * i + 1) + "%", color: this.state.tab === i ? "var(--tint-color)": ""}}>{tab.tabname}</div>
                );
              }) }
              <div className="pillSelectorLine" style={{left: (50 / this.state.config.tabs!.length || 0) * (2 * this.state.tab + 1) + "%"}}></div>
            </div>
            <div id="mainWrapper">
              { this.state.config.tabs?.map((tab, i) => {
                if (i == this.state.tab) {
                  return (
                    <div className="tabContent" id={`${tab.tabname}Content`} key={i}>
                      { tab.views.map((view, i) => {
                        return (
                          <div key={i}>
                            <ViewLoader view={view} showScreenshots={this.showScreenshots} />
                          </div>
                        );
                      }) }
                    </div>
                  );
                }
              }) }
            </div>
          </div>
        </div>
      </div>
    );
  }
}