import React from "react";
import Color from "color";
import { Scrollbar } from "react-scrollbars-custom";

import DepictionEditor from "./DepictionEditor";
import theme from "../../includes/theme";

class EditorView extends React.Component {
  props: {
    theme: "dark" | "light"
    onUpdate: (depiction: any) => any
    depiction: any
    overPhone: boolean
    tintColor: string
    name: string
    developer: string
    icon: string
  } = this.props

  state = {
    widthRelPx: 0,
    widthRel: 0,
    activeTab: "Details",
    indicatorWidth: 0,
    indicatorWidthCalc: 0,
    indicatorLeft: 0,
    indicatorLeftCalc: 0,
    scrollTop: -1,
    scrollFollow: false
  }

  scrollState = 0

  ref: { [x: string]: { current: HTMLElement } } = {
    MainView: React.createRef(),
    StartTab: React.createRef(),
  } as any

  maxWidth = 500

  calculatePixels () {
    return Math.min(1, this.ref.MainView.current.clientWidth / this.maxWidth);
  }

  listener = {
    windowResize: () => {
      if (!this.ref.MainView.current) return;
      let calculatedPixels = this.calculatePixels();
      if (calculatedPixels !== this.state.widthRelPx) this.setState({
        widthRelPx: calculatedPixels,
        widthRel: this.ref.MainView.current.clientWidth,
        indicatorLeftCalc: this.state.indicatorLeft * calculatedPixels,
        indicatorWidthCalc: this.state.indicatorWidth * calculatedPixels });
      if (this.state.indicatorWidth === 0 && this.ref.StartTab.current) this.setState({
        indicatorLeft: this.ref.StartTab.current.offsetLeft / calculatedPixels,
        indicatorWidth: this.ref.StartTab.current.clientWidth / calculatedPixels,
        indicatorLeftCalc: this.ref.StartTab.current.offsetLeft,
        indicatorWidthCalc: this.ref.StartTab.current.clientWidth })
    }
  }

  componentDidMount () {
    window.addEventListener("resize", this.listener.windowResize);
    setInterval(() => {
      this.listener.windowResize();
    }, 50);
    setTimeout(() => {
      let isRendered = () => !!this.calculatePixels();
      if (!isRendered) this.listener.windowResize();
      let interval = setInterval(() => {
        if (isRendered()) {
          clearInterval(interval);
          this.listener.windowResize();
          setTimeout(() => {
            this.listener.windowResize();
          }, 10);
        }
      }, 10);
    }, 10);
  }

  componentWillUnmount () {
    window.removeEventListener("resize", this.listener.windowResize);
  }

  render() {
    return (
      <Scrollbar scrollTop={this.scrollState} onScroll={(ev: any) => {this.scrollState = ev.scrollTop; this.state.scrollTop !== -1 && this.setState({ scrollTop: ev.scrollTop })}}>
        <div
        className="block relative flex flex-col min-h-full text-white overflow-hidden transition"
        ref={this.ref.MainView as any}
        style={{
          ...{ "--dpx": this.state.widthRelPx } as any,
          backgroundColor: theme(this.props.theme).bg,
          color: theme(this.props.theme).fg,
          minHeight: 2436 / 1125 * this.state.widthRel,
          //background: "url(/assets/sileo/11.png)",
          backgroundPosition: "top left",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain"
        }}
        >
          <div className="absolute z-100 top-0 left-0 w-full text-white user-select-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="375" height="44" viewBox="0 0 375 44" style={{ width: "100%", height: `calc(${this.maxWidth / 375 * 44}px * var(--dpx))` }}>
            <rect width="375" height="44" fill="rgba(0,0,0,0)" opacity="0.001"/>
            <g transform="translate(21 13)">
              <g transform="translate(315.672 3.333)">
                <g fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="1" opacity="0.35">
                  <rect width="22" height="11.333" rx="2.667" stroke="none"/>
                  <rect x="0.5" y="0.5" width="21" height="10.333" rx="2.167" fill="none"/>
                </g>
                <path fill="currentColor" d="M0,0V4A2.17,2.17,0,0,0,1.328,2,2.17,2.17,0,0,0,0,0" transform="translate(23 3.667)" opacity="0.4"/>
                <rect fill="currentColor" width="18" height="7.333" rx="1.333" transform="translate(2 2)"/>
              </g>
              <path fill="currentColor" d="M7.667,11a.314.314,0,0,1-.222-.093L5.439,8.885a.31.31,0,0,1-.094-.231.316.316,0,0,1,.1-.227,3.437,3.437,0,0,1,4.437,0,.315.315,0,0,1,.009.458L7.889,10.907A.314.314,0,0,1,7.667,11ZM11.19,7.451a.313.313,0,0,1-.215-.086,4.928,4.928,0,0,0-6.612,0,.313.313,0,0,1-.215.086.308.308,0,0,1-.22-.091L2.768,6.189a.322.322,0,0,1,0-.46,7.192,7.192,0,0,1,9.791,0,.323.323,0,0,1,.1.23.319.319,0,0,1-.095.23L11.409,7.36A.309.309,0,0,1,11.19,7.451Zm2.669-2.693a.3.3,0,0,1-.215-.088,8.68,8.68,0,0,0-11.955,0,.307.307,0,0,1-.435,0L.094,3.5a.323.323,0,0,1,0-.457,10.948,10.948,0,0,1,15.141,0,.323.323,0,0,1,0,.457l-1.161,1.17A.306.306,0,0,1,13.859,4.758Z" transform="translate(295.339 3.331)"/>
              <path fill="currentColor" d="M16,10.667H15a1,1,0,0,1-1-1V1a1,1,0,0,1,1-1h1a1,1,0,0,1,1,1V9.667A1,1,0,0,1,16,10.667Zm-4.667,0h-1a1,1,0,0,1-1-1V3.334a1,1,0,0,1,1-1h1a1,1,0,0,1,1,1V9.667A1,1,0,0,1,11.334,10.667Zm-4.667,0h-1a1,1,0,0,1-1-1v-4a1,1,0,0,1,1-1h1a1,1,0,0,1,1,1v4A1,1,0,0,1,6.666,10.667ZM2,10.667H1a1,1,0,0,1-1-1v-2a1,1,0,0,1,1-1H2a1,1,0,0,1,1,1v2A1,1,0,0,1,2,10.667Z" transform="translate(273.339 3.667)"/>
              <g>
                <path fill="currentColor" d="M16.134,14.256c2.688,0,4.285-2.1,4.285-5.669,0-3.5-1.7-5.42-4.226-5.42a3.674,3.674,0,0,0-3.926,3.706,3.382,3.382,0,0,0,3.479,3.508,2.916,2.916,0,0,0,2.739-1.575h.125c-.022,2.483-.908,3.9-2.454,3.9a1.833,1.833,0,0,1-1.86-1.3H12.413A3.546,3.546,0,0,0,16.134,14.256ZM16.2,8.924a2,2,0,0,1-2.08-2.109,2.088,2.088,0,1,1,4.175.037A2.01,2.01,0,0,1,16.2,8.924Zm7.237-1.765a1.136,1.136,0,1,0-1.172-1.135A1.11,1.11,0,0,0,23.437,7.159Zm0,5.376A1.136,1.136,0,1,0,22.265,11.4,1.114,1.114,0,0,0,23.437,12.535ZM31.611,14H33.42V11.971h1.428v-1.56H33.42V3.431H30.754c-1.436,2.183-2.937,4.614-4.307,6.995v1.545h5.164ZM28.2,10.345c1.033-1.794,2.256-3.75,3.34-5.405h.1v5.515H28.2ZM38.877,14h1.89V3.431H38.884L36.123,5.372v1.78l2.629-1.86h.125Z"/>
              </g>
            </g>
          </svg>
          </div>
          <div
          className="relative border-none bg-cover bg-center bg-no-repeat z-79"
          style={{ height: "calc(266px * var(--dpx))", background: this.props.depiction.headerImage && `url("${this.props.depiction.headerImage}") no-repeat center/cover` || this.props.tintColor }}
          >
            <div className="absolute w-full h-full left-0 top-0 z-80" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0) 70%)" }} />
          </div>
          <div className="px-24dpx pt-24dpx pb-8dpx flex relative">
            <div className="w-84dpx h-84dpx rounded-25 flex-shrink-0 user-select-none overflow-hidden">
              <img className="w-full h-full" src={this.props.icon || "/assets/Wrench.svg"} />
            </div>
            <div className="pl-14dpx mt-8dpx mr-14dpx ml-0 mb-0 overflow-hidden flex-grow-0 w-full">
              <h1 className="text-27dpx font-semibold font-display truncate">{this.props.name}</h1>
              <p className="text-22dpx font-regular truncate opacity-35 mt-6dpx">{this.props.developer}</p>
            </div>
            <button
            className="font-text flex-shrink-0 border-0 inline-block min-w-96dpx px-8dpx py-6dpx rounded-full my-auto text-22dpx font-semibold text-white text-center cursor-pointer"
            style={{ backgroundColor: this.props.tintColor }}
            >
              GET
            </button>
          </div>
          <div
          className="flex flex-row relative px-18dpx justify-around mt-12dpx cursor-default font-sansT font-regular border-solid"
          style={{ borderColor: Color(theme(this.props.theme).fg).alpha(0.125).toString(), borderBottomWidth: "calc(2px * var(--dpx))" }}
          >
            <div
            className="block absolute h-2dpx bottom-n2dpx"
            style={{ backgroundColor: this.props.tintColor, left: this.state.indicatorLeftCalc, width: this.state.indicatorWidthCalc, transition: "left .2s linear, width .2s ease" }}
            />
            {this.props.depiction.tabs.map((el: any) => (
              <div
              className="cursor-pointer text-23dpx block relative pt-0 pb-10dpx px-6dpx opacity-35 font-text"
              key={"TabList_" + el.tabname}
              {...(el.tabname === this.state.activeTab && { ref: this.ref.StartTab } || {}) as any}
              onLoad={elm => el === this.state.activeTab && this.setState({ indicatorLeft: elm.currentTarget.offsetLeft, indicatorWidth: elm.currentTarget.clientWidth })}
              onClick={elm => this.setState({
                activeTab: el.tabname,
                indicatorLeft: elm.currentTarget.offsetLeft / this.state.widthRelPx,
                indicatorWidth: elm.currentTarget.clientWidth / this.state.widthRelPx,
                indicatorLeftCalc: elm.currentTarget.offsetLeft,
                indicatorWidthCalc: elm.currentTarget.clientWidth })}
              style={{ ...(this.state.activeTab === el.tabname && { color: this.props.tintColor, opacity: 1 } || {}) }}
              >
                {el.tabname}
              </div>
            ))}
          </div>
          {this.props.depiction.tabs.map((item: any, index: number) => item.tabname === this.state.activeTab && (
            <div className={"w-full" + " DepictionView_" + item.tabname} key={"DepictionView_" + item.tabname}>
              <DepictionEditor
              theme={this.props.theme}
              onUpdate={(views) => {
                let tabs = [...this.props.depiction.tabs];
                tabs[index] = { ...this.props.depiction.tabs[index], views };
                this.props.onUpdate({ ...this.props.depiction, tabs });
              }}
              views={[...item.views]}
              themeColor={this.props.tintColor}
              widthRelPx={this.state.widthRelPx}
              widthRel={this.state.widthRel}
              onOpen={ev => this.setState({ scrollTop: ev && this.scrollState || -1 })}
              scrollTop={this.state.scrollTop !== -1 && this.state.scrollTop || this.scrollState}
              uneditable={!item.editable}
              overPhone={this.props.overPhone}
              />
            </div>
          ))}
        </div>
      </Scrollbar>
    );
  }
}

export default EditorView;