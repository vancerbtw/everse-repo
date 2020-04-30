import React from "react";
import ViewLoader from "./ViewLoader";
import Head from 'next/head'
import { DropResult, DragDropContext, Droppable, Draggable, DroppableProvided, DraggableProvided, DraggableStateSnapshot } from "react-beautiful-dnd";

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

const getItems = (count: number) =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k}`,
    content: `item ${k}`
  }));

const reorder = (list: DepictionView[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging: any, draggableStyle: any) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle
});

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

    this.onDragEnd = this.onDragEnd.bind(this);
    this.showScreenshots = this.showScreenshots.bind(this);
  }

  onDragEnd(result: DropResult) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    let depiction = this.state.config

    const items = reorder(
      depiction.tabs![this.state.tab].views,
      result.source.index,
      result.destination.index
    );

    depiction.tabs![this.state.tab].views = items;

    this.setState({
      config: depiction
    });
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
                      <DragDropContext onDragEnd={this.onDragEnd}>
                        <Droppable droppableId="droppable">
                          {(provided: DroppableProvided, snapshot) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                            >
                            { tab.views.map((view, i) => (
                                <Draggable key={i} draggableId={`${i}`} index={i}>
                                  {(provided: DraggableProvided, snapshotDraggable:DraggableStateSnapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={getItemStyle(
                                        snapshotDraggable.isDragging,
                                        provided.draggableProps.style
                                      )}
                                    >
                                      <ViewLoader view={view} showScreenshots={this.showScreenshots} { ...{ provided: provided, snapshot: snapshotDraggable } as any } />
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>
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