import React from "react";
import ViewLoader from "../../components/ViewLoader";
import { host } from "../../backend/Helpers/Host";

interface DepictionView {
  class: string;
  title: string;
};

interface DepictionTab {
  tabname: string;
  class: string;
  views: DepictionView[];
}

type DepictionProps = {};

type DepictionState = {
  config: { 
    class: string;
    headerImage?: string;
    tabs?: DepictionTab[];
  } | undefined,
  query?: URLSearchParams,
  tab: number,
  screenshot: string | undefined,
  borderRadius: string,
  icon: string,
  name: string,
  developer: string
};

export default class Depiction extends React.Component<DepictionProps, DepictionState> {
  constructor(props: DepictionProps) {
    super(props);

    this.state = {
      config: undefined,
      tab: 0,
      screenshot: undefined,
      borderRadius: "8px",
      icon: "",
      name: "",
      developer: ""
    };

    this.showScreenshots = this.showScreenshots.bind(this);
  }

  componentDidMount() {
    const queries = new URLSearchParams(window.location.search);
    const id = queries.get("id") ? "id=" + queries.get("id") + "&": "";
    const item = queries.get("package") ? "package=" + queries.get("package"): "";
    fetch(`${host}/content/depiction?${id}${item}`).then((res) => {console.log(res); return res.json()}).then((config) => {
      const json: { class: string; headerImage?: string; tabs?: DepictionTab[]; } = JSON.parse(config.depiction);
      const name: string = config.name;
      const developer: string = config.developer;
      const icon: string = config.icon;

      this.setState({ config: json, query: new URLSearchParams(window.location.search), name, developer, icon });
    }).catch(e => {
      console.log(e);
    });
  }

  showScreenshots(url: string, borderRadius: string) {
    this.setState({
      screenshot: url,
      borderRadius
    });
  }
  
  render() {
    if (!this.state.config) {
      return (
        <div id="everythingWrapper">
          <div id="bannerWrapper">
            <div id="bannerImage" style={{backgroundImage: ""}}></div>
          </div>
          <div className="navbar">
            <div className="leftNavButton">
              <a className="backURL">
                <div className="backArrow"></div>Back
              </a>
            </div>
            <div className="changedNavbarItems">
              <div id="navbarTweakIcon"></div>
              <div className="rightNavButton">
                <div className="priceButton" onClick={() => {}}>Free</div>
              </div>
            </div>
          </div>
  
          <div className="contentWrapper">
            <div className="headerSection">
              <div id="tweakIcon"></div>
              <h1 id="tweakName"></h1>
              <h4 id="developerName"></h4>
              <div className="priceButton">Free</div>
            </div>
            <div className="headerPillSelector">
              <div className="pillSelectorLine"></div>
            </div>
            <div id="mainWrapper">
              <div id="reloadingRepoWrapper">
                <img src="https://pinpal.github.io/Sileo-Depiction-WebViews/assets/loading.gif" />
                <div id="reloadingRepoText">Fetching Sileo Depiction</div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    let screenshotViewer;

    if (this.state.screenshot) {
      screenshotViewer = (
        <div>
          <div className="screenshotBackground">

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
      <div id="everythingWrapper" className="wrapper">
        {screenshotViewer}
        <div id="bannerWrapper">
          <div id="bannerImage" style={{backgroundImage: `url(${this.state.config.headerImage})`}}></div>
          <div id="bannerNavItems">
              <div className="leftNavButton">
                  <a className="backURL" style={{color: "white"}}>
                      <div className="backArrow"></div>Back
                  </a>
              </div>
              <div className="rightNavButton">
                  <div className="modifyButton"></div>
              </div>
          </div>
        </div>

        <div className="navbar">
          <div className="leftNavButton">
            <a className="backURL">
              <div className="backArrow"></div>Back
            </a>
          </div>
          <div className="changedNavbarItems">
            <div id="navbarTweakIcon"></div>
            <div className="rightNavButton">
              <div className="priceButton" onClick={() => {}}>Free</div>
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
    );
  }
}