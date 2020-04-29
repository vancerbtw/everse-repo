import React from "react";
import ViewLoader from "../../components/ViewLoader";
import { host } from "../../backend/Helpers/Host";
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

interface verifyResponse { 
  success: Boolean, 
  error?: string, 
  session: { email: string, username: string, developer: Boolean } 
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
  developer: string,
  identifier: string,
  currentScrollHeight: number,
  cydia: Boolean,
  loggedIn: Boolean | undefined,
  bannerText: string,
  user: { email: string, username: string, developer: Boolean } | undefined
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
      developer: "",
      identifier: "",
      currentScrollHeight: 0,
      cydia: false,
      loggedIn: undefined,
      bannerText: "Login to download purchased packages",
      user: undefined
    };

    this.showScreenshots = this.showScreenshots.bind(this);
  }

  componentDidUpdate() {
    console.log(this.props)
  }

  componentDidMount() {
    window.addEventListener("focus", () => {
      const queries = new URLSearchParams(window.location.search);
      const id = queries.get("id") ? "id=" + queries.get("id") + "&": "";
      const item = queries.get("package") ? "package=" + queries.get("package"): "";
      fetch(`${host.self}/content/depiction?${id}${item}`).then(res => res.json()).then((config) => {
        const json: { class: string; headerImage?: string; tabs?: DepictionTab[]; } = JSON.parse(config.depiction);
        const name: string = config.name;
        const developer: string = config.developer;
        const icon: string = config.icon;

        this.setState({ config: json, query: new URLSearchParams(window.location.search), name, developer, icon });
      }).catch(e => {
        console.log(e);
      });

      if (queries.get("token")) {
        this.setState({ cydia: true });

        fetch(`${host.self}/sessions/verify`,  {
          method: "post",
          body: JSON.stringify({ token: queries.get("token") }),
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(res => res.json()).then((res: verifyResponse) => {
          console.log(res)
          
          if (!res.success && res.error) {
            this.setState({
              bannerText: res.error,
              loggedIn: false
            });
          }
          
          if (!res.success && !res.error) {
            this.setState({
              bannerText: "Login to download purchased packages",
              loggedIn: false
            });
          }

          

          if (res.success) {
            this.setState({
              bannerText: res.session.username,
              loggedIn: true,
              user: {
                email: res.session.email,
                username: res.session.username,
                developer: res.session.developer
              }
            });
          }
        }).catch((e) => {
          console.log(e)
        });
      }
    })
    window.onscroll = () =>{
      const newScrollHeight = Math.ceil(window.scrollY / 50) *50;
      if (this.state.currentScrollHeight != newScrollHeight){
          this.setState({currentScrollHeight: newScrollHeight})
      }
    }

    const queries = new URLSearchParams(window.location.search);
    const id = queries.get("id") ? "id=" + queries.get("id") + "&": "";
    const item = queries.get("package") ? "package=" + queries.get("package"): "";
    fetch(`${host.repo}/content/depiction?${id}${item}`).then(res => res.json()).then((config) => {
      const json: { class: string; headerImage?: string; tabs?: DepictionTab[]; } = JSON.parse(config.depiction);
      const name: string = config.name;
      const developer: string = config.developer;
      const icon: string = config.icon;
      const identifier: string = config.identifier;

      this.setState({ config: json, query: new URLSearchParams(window.location.search), name, developer, icon, identifier });
    }).catch(e => {
      console.log(e);
    });

    if (queries.get("token")) {
      this.setState({ cydia: true });

      fetch(`${host.repo}/sessions/verify`,  {
        method: "post",
        body: JSON.stringify({ token: queries.get("token") }),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json()).then((res: verifyResponse) => {
        console.log(res)
        if (!res.success && res.error) {
          this.setState({
            bannerText: res.error,
            loggedIn: false
          });
        }
        
        if (!res.success && !res.error) {
          this.setState({
            bannerText: "Login to download purchased packages",
            loggedIn: false
          });
        }

        if (res.success) {
          this.setState({
            bannerText: res.session.email,
            loggedIn: true,
            user: {
              email: res.session.email,
              username: res.session.username,
              developer: res.session.developer
            }
          });
        }
      }).catch((e) => {
        console.log(e)
      });
    }

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

    let cydiaBanner;
    if (this.state.cydia && this.state.loggedIn != undefined) {
      if (this.state.loggedIn) {
        cydiaBanner = (
          <div className="cydia-banner">
            <h3 className="cydia-text">{this.state.bannerText}</h3>
            <div className="cydia-button" onClick={() => {
                fetch(`http://192.168.7.50:3004/sessions/disable`,  {
                  method: "post",
                  body: JSON.stringify({ token: new URLSearchParams(window.location.search).get("token") }),
                  headers: {
                    'Content-Type': 'application/json'
                  }
                }).then(res => res.json()).then((res: { success: Boolean, error: string }) => {
                  if (!res.success) {
                    this.setState({
                      bannerText: res.error,
                      user: undefined,
                      loggedIn: false
                    });
                  } else {
                    this.setState({
                      bannerText: "Login to download purchased packages",
                      user: undefined,
                      loggedIn: false
                    });
                  }
                 });
              }}> 
              <a className="priceButton">Logout</a>
            </div>
          </div>
        );
      } else {
        cydiaBanner = (
          <div className="cydia-banner">
            <h3 className="cydia-text">{this.state.bannerText}</h3>
            <div className="cydia-button"> 
              <a className="priceButton" href={"http://192.168.7.50:3004/device/auth?token=" + new URLSearchParams(window.location.search).get("token") + "&package=" + this.state.identifier}>Login</a>
            </div>
          </div>
        );
      }
    }

    const opacity = window.pageYOffset / 253 * 1

    return (
      <div>
        <Head>
          <title>test</title>
          <base target="_open"></base>
        </Head>
        <div id="everythingWrapper" className="wrapper">
          {screenshotViewer}
          {cydiaBanner}
          <div id="bannerWrapper">
            <div id="bannerImage" style={{backgroundImage: `url(${this.state.config.headerImage})`}}></div>
            <div id="bannerNavItems">
                <div className="rightNavButton">
                    <div className="modifyButton"></div>
                </div>
            </div>
          </div>

          <div className="navbar" style={{ opacity, visibility: window.pageYOffset >= 45 ? "visible": "hidden"}}>
            <div className="leftNavButton">
              <h1 id="tweakName" style={{ overflow: "visible", opacity: window.pageYOffset >= 253 ? 1 : 0 }}>{this.state.name}</h1>
            </div>
            <div className="changedNavbarItems" style={{ opacity: window.pageYOffset >= 253 ? 1 : 0}}>
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
                            <ViewLoader view={view} showScreenshots={this.showScreenshots}  />
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