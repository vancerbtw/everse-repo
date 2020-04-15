import react from "react";
import Preview from "../../components/DepictionPreview";
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

type depiction = { 
  class: string;
  headerImage?: string;
  tabs?: DepictionTab[];
}

type EditorProps = {}

type EditorState = {
  depiction: depiction | undefined;
  data: {
    name: string;
    developer: string;
    icon: string | undefined;
    identifier: string;
  } | undefined;
}

class Editor extends react.Component<EditorProps, EditorState>{
  constructor(props: EditorProps) {
    super(props);

    this.state = {
      depiction: undefined,
      data: undefined
    };
  };

  componentDidMount() {
    fetch(`${host.repo}/content/depiction?id=1`).then(res => res.json()).then((config) => {
      const json: { class: string; headerImage?: string; tabs?: DepictionTab[]; } = JSON.parse(config.depiction);
      const name: string = config.name;
      const developer: string = config.developer;
      const icon: string = config.icon;
      const identifier: string = config.identifier;

      this.setState({ depiction: json, data: {
        name,
        developer,
        icon,
        identifier
      }});
    }).catch(e => {
      console.log(e);
    });
  }

  render() {
    if (!this.state.depiction) {
      return (
        <div></div>
      )
    }

    return (
      <div>
        <div className="w-screen h-screen">
        </div>
        <div id="editorEverythingWrapper">
          <div className="absolute bg-gray-500 rounded-tl-xl rounded-bl-xl transform -translate-y-1/2" style={{width: "calc(100% - ((100vh - 120px)/2.11))", height: "calc(100% - 55px)", padding: "25px", maxHeight: "750px", top: "50%", left: "0"}}></div>
          <img src="/iX.png" className="absolute transform -translate-y-1/2" style={{pointerEvents: "none", width: "calc((100vh - 105px)/2.11)", height: "calc(100vh - 105px)", top: "50%", right: "0", zIndex: 100000}} />
          <div className="absolute transform -translate-y-1/2 overflow-y-scroll" style={{ right: "25px", width: "calc(((100vh - 105px)/2.11) - 50px)", height: "calc((100vh - 105px) - 50px)", top: "50%" }}>
            <Preview depiction={this.state.depiction} data={this.state.data!} />
          </div>
        </div>
      </div>
    )
  }
}

export default Editor;