import React from "react";
import Color from "color";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Scrollbar } from "react-scrollbars-custom";
import DepictionClass from "./DepictionClass";

import theme from "../../includes/theme";

const reorder = (list: any, startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [ removed ] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const remove = (list: any, index: number) => {
  const result = Array.from(list);
  result.splice(index, 1);
  return result;
}

class EditorView extends React.Component {
  props: {
    theme: "dark" | "light"
    views: any
    onUpdate: (views: any) => any
    widthRelPx: number
    widthRel: number
    themeColor: string
    scrollTop?: number
    onOpen?: (val: boolean) => any
    uneditable?: boolean
    overPhone?: boolean
  } = this.props


  state: { addButtonHovered: boolean, addViewOpen: boolean, currentBeingDragged: string | false } = {
    addButtonHovered: false,
    addViewOpen: false,
    currentBeingDragged: false
  }

  ref: { [x: string]: { current: HTMLElement } } = {

  } as any

  render() {
    return (
      <div className="flex flex-col pb-64dpx">
        {!this.props.uneditable && (
          <>
            <DragDropContext 
            onDragEnd={(result) => {
              this.setState({ currentBeingDragged: false });
              if (!result.destination) return;
              const items = reorder(
                this.props.views,
                result.source.index,
                result.destination.index
              );
              this.props.onUpdate(items);
            }}
            onBeforeDragStart={(ev) => {
              this.setState({ currentBeingDragged: ev.draggableId });
            }}
            >
              <Droppable droppableId={"drag_drop_builder"} isCombineEnabled={false}>
                {(provided, snapshot) => (
                  <div className="px-8dpx py-4dpx" {...provided.droppableProps} ref={provided.innerRef}>
                    {this.props.views.map((item: any, index: any) => {
                      return (
                        <Draggable index={index} key={item._id + ""} draggableId={"ddb_" + item._id}>
                          {(provided, snapshot) => (
                            <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            style={{ zIndex: 102, position: "relative", pointerEvents: (this.state.currentBeingDragged && this.state.currentBeingDragged !== "ddb_" + item._id) ? "none" : undefined, ...provided.draggableProps.style }}>
                              <DepictionClass
                              theme={this.props.theme}
                              widthRelPx={this.props.widthRelPx}
                              themeColor={this.props.themeColor}
                              item={item}
                              setDraggableState={ev => !ev ? this.setState({ currentBeingDragged: "ddb_" + item._id }) : this.setState({ currentBeingDragged: false })}
                              isDragging={snapshot.isDragging}
                              dragHandleProps={provided.dragHandleProps}
                              overPhone={this.props.overPhone}
                              onDelete={() => this.props.onUpdate(remove(this.props.views, index))}
                              onEdit={(item) => {
                                let items = this.props.views;
                                items[index] = item;
                                this.props.onUpdate(items);
                              }}
                              />
                            </div>
                          )}
                        </Draggable>
                      )
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            <div>
              <div
              className="flex justify-center cursor-pointer w-full"
              onClick={() => {this.setState({ addViewOpen: true }); (this.props.onOpen && this.props.onOpen(true))}}
              onMouseEnter={() => this.setState({ addButtonHovered: true })}
              onMouseLeave={() => this.setState({ addButtonHovered: false })}
              >
                <img
                src="/assets/add.svg"
                className="w-24dpx h-64dpx m-12dpx"
                style={{ filter: this.props.theme === "dark" ? "invert()" : "", opacity: this.state.addButtonHovered ? 1 : 0.4 }}
                />
              </div>
              {this.state.addViewOpen && (
                <div className="absolute w-full flex flex-col justify-center items-center top-0 left-0" style={{ height: 2436 / 1125 * this.props.widthRel, top: this.props.scrollTop }}>
                  <div
                  className="absolute" onClick={() => {this.setState({ addViewOpen: false }); (this.props.onOpen && this.props.onOpen(true))}}
                  style={{ top: "-50000px", left: "-50000px", width: "100000px", height: "100000px", zIndex: 1000, backgroundColor: "rgba(0,0,0,0.5)" }}
                  />
                  <div
                  className="relative rounded-20dpx px-12dpx w-4/5 overflow-hidden"
                  style={{ zIndex: 1001, backgroundColor: theme(this.props.theme).bg, minHeight: "calc(800px * var(--dpx))" }}
                  >
                    <Scrollbar style={{ minHeight: "inherit" }}>
                      {["Header", "Subheader", "Label", "Markdown", "Image", "Screenshots", "Separator", "Spacer", "Table Button", "Table Text"].map(el => (
                        <div
                        className="flex flex-col items-center relative mr-5 cursor-pointer"
                        key={el}
                        onClick={() => {
                          let name = el.replace(/\s/g, "");
                          let items = this.props.views;
                          let _id = Array.from(crypto.getRandomValues(new Uint8Array(16))).map(e => e.toString(16).padStart(2, "0")).join("");
                          let item: any = { class: `Depiction${name}View`, _id };
                          if (name === "Spacer") {
                            item.spacing = 4;
                          };
                          items.push(item);
                          this.props.onUpdate(items);
                          this.setState({ addViewOpen: false });
                          (this.props.onOpen && this.props.onOpen(false));
                        }}>
                          <div
                          className="w-full rounded-10dpx flex flex-col justify-end items-end my-8dpx"
                          style={{
                            height: "calc(200px * var(--dpx))",
                            background: `url(/assets/view-previews/Depiction${el.replace(/\s/g, "")}View.svg) center/cover repeat`,
                          }}
                          >
                            <p
                            className={"text-24dpx uppercase font-bold py-8dpx px-24dpx rounded-tl-10dpx rounded-br-10dpx" + (this.props.theme === "dark" ? " text-white" : " text-black")}
                            style={{ backgroundColor: theme(this.props.theme).bg + "80", backdropFilter: "blur(20px)" }}
                            >
                              {el}
                            </p>
                          </div>
                        </div>
                      ))}
                    </Scrollbar>
                  </div>
                </div>
              )}
            </div>
          </>
        ) || (
          <div className="px-8dpx py-4dpx">
            {this.props.views.map((item: any, index: any) => (
              <DepictionClass
              key={item._id || Array.from(crypto.getRandomValues(new Uint8Array(6))).map(e => e.toString(16).padStart(2, "0")).join("")}
              theme={this.props.theme}
              widthRelPx={this.props.widthRelPx}
              themeColor={this.props.themeColor}
              uneditable={true}
              item={item}
              isDragging={false}
              onDelete={() => {}}
              onEdit={() => {}}
              />
            ))}
          </div >
        )}
      </div>
    );
  }
}

export default EditorView;