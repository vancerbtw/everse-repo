import React from "react";
import ColorPicker from "../../../components/ColorPicker";
import PhoneFrame from "../../../components/PhoneFrame";
import Logo from "../../../components/Logo";
import EditorView from "../../../components/EditorView";
import {host} from "../../../backend/Helpers/Host";

import { theme2 } from "../../../includes/theme";

let template = {
  "class": "DepictionTabView",
  "minVersion": "0.1",
  "_tweakInfo": {
    "icon": null,
    "name": "Unnamed Tweak",
    "author": "Unknown Developer",
    "price": false
  },
  "tintColor": "#2CB1BE",
  "tabs": [
    {
      "class": "DepictionStackView",
      "tabname": "Details",
      "editable": true,
      "views": []
    }
  ]
};

interface DepictionView {
  class: string;
  title: string;
};

interface DepictionTab {
  tabname: string;
  class: string;
  views: DepictionView[];
}

class DepictionDesigner extends React.Component {
  state: { name: string, developer: string, icon: string, fetched: boolean, tintColor: string, dark: boolean, colorOpen: boolean, depiction: any, overPhone: boolean, depictionLoad: { get: string | false, save: string | false } } = {
    dark: false,
    colorOpen: false,
    depiction: {},
    tintColor: "",
    overPhone: false,
    depictionLoad: /* {
      get: "http://172.24.2.128:81",
      save: "http://172.24.2.128:81"
    } */ {
      get: false,
      save: false
    },
    fetched: false,
    name: "",
    developer: "",
    icon: ""
  }

  alreadyFetched = false

  constructor(props: any) {
    super(props);
  }

  onUpdate (updated: any) {
    if (updated.tintColor) return this.setState({ tintColor: updated.tintColor });
  }

  componentWillUpdate() {
    console.log(this.state)
  }

  componentDidMount () {
    const queries = new URLSearchParams(window.location.search);
    const id = queries.get("id") ? "id=" + queries.get("id") + "&": "";
    const item = queries.get("package") ? "package=" + queries.get("package"): "";

    if (!this || !this.alreadyFetched) {
      fetch(`${host.repo}/content/depiction?${id}${item}`).then(async res => {
        let json = await res.json();
        let depiction;

        try {
          depiction = JSON.parse(json.depiction);
        } catch {
          return;
        }

        const name: string = json.name;
        const developer: string = json.developer;
        const icon: string = json.icon;
        this.setState({ depiction, tintColor: depiction.tintColor, fetched: true, name, developer, icon });
        this.alreadyFetched = true;
      });
    }

    this.setState({ dark: (window.localStorage.getItem("ed_depiction_editor__dark_mode") === "true" || false) });
  }

  save () {
    let { depiction } = this.state;
    if (this.state.depictionLoad.save) {
      fetch(this.state.depictionLoad.save, {
        method: "POST",
        body: JSON.stringify(depiction)
      });
    } else {
      window.localStorage.setItem("ed_depiction_editor__depiction", JSON.stringify(depiction));
    }
  }

  render() {
    if (this.state.depiction.class && this.state.fetched) {
      return (
        <>
          <div
          className="flex relative p-5 w-full min-h-screen transition"
          style={{ backgroundColor: theme2(this.state.dark && "dark" || "light").bg }}
          >
            <Logo dark={!this.state.dark} />
            <div
            className="inline-flex flex-col justify-center items-center my-16 mx-auto"
            style={{ minHeight: "calc(100vh - 2*4rem - 2*1.25rem)" }}
            >
              <div className="flex flex-row mb-8 w-full items-center">
                <button
                className={"inline-flex font-sans text-base border-none bg-transparent leading-6 font-bold cursor-pointer mr-auto" + (!this.state.dark && " text-black" || " text-white")}
                onClick={e => {
                  window.localStorage.setItem("ed_depiction_editor__dark_mode", (!this.state.dark + ""));
                  this.setState({ dark: !this.state.dark });
                }}
                >
                  <img
                  className="inline-block h-6 pr-3"
                  src="/assets/darkMode.svg"
                  style={{ filter: !this.state.dark && "invert()" || "" }}
                  />
                  Toggle Theme
                </button>
                <div className="relative">
                  <button
                  className={"inline-flex font-sans text-base border-none bg-transparent leading-6 font-bold cursor-pointer ml-6" + (!this.state.dark && " text-black" || " text-white")}
                  onClick={e => this.setState({ colorOpen: true })}
                  >
                    Change Accent Color
                    <img
                    className="inline-block h-6 pl-3"
                    src="/assets/editColor.svg"
                    style={{ filter: !this.state.dark && "invert()" || "" }}
                    />
                  </button>
                  {this.state.colorOpen && (
                    <ColorPicker
                    onChange={e => this.onUpdate({ tintColor: e })}
                    onClose={e => this.setState({ colorOpen: false })}
                    color={this.state.depiction.tintColor}
                    style={{ position: "absolute", top: 40, right: 0 }}
                    />
                  )}
                </div>
              </div>
              <div
              onMouseEnter={() => this.setState({ overPhone: true })}
              onMouseLeave={() => this.setState({ overPhone: false })}
              >
                <PhoneFrame dark={this.state.dark}>
                  <EditorView theme={this.state.dark ? "dark" : "light"} depiction={JSON.parse(JSON.stringify(this.state.depiction))} onUpdate={e => this.onUpdate(e)} overPhone={false && this.state.overPhone} tintColor={this.state.tintColor} name={this.state.name} developer={this.state.developer} icon={this.state.icon} />
                </PhoneFrame>
              </div>
              <div className="flex flex-row mt-8 w-full items-center">
                <button
                className={"inline-flex font-sans text-base border-none bg-transparent leading-6 font-bold cursor-pointer mx-auto" + (!this.state.dark && " text-black" || " text-white")}
                onClick={el => this.save()}
                >
                  <img
                  className="inline-block h-6 pr-3"
                  src="/assets/download.svg"
                  style={{ filter: !this.state.dark && "invert()" || "" }}
                  />
                  Save
                </button>
              </div>
            </div>
          </div>
        </>
      );
    } else {
      return (
        <></>
      );
    }
  }
}

export default DepictionDesigner;

