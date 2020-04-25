import React from "react";
import Color from "color";
import HeaderView from "./DepictionClasses/Header";
import SubheaderView from "./DepictionClasses/Subheader";
import SeparatorView from "./DepictionClasses/Separator";
import SpacerView from "./DepictionClasses/Spacer";

import theme from "../../includes/theme";

class DepictionClass extends React.Component {
  props: {
    theme: "dark" | "light"
    themeColor?: string,
    widthRelPx: number,
    isDragging: boolean,
    item: any,
    dragHandleProps?: any,
    onEdit: (item: any) => any,
    onDelete: () => any,
    uneditable?: boolean,
    overPhone?: boolean,
    setDraggableState?: (bool: boolean) => any
  } = this.props

  state = {
    isEditMode: false,
    isHovering: false,
    shouldLeave: true,
    mouseIsInside: false
  }

  render() {
    return (
      <div
      className={"block rounded-10dpx border-dotted px-10dpx relative transition flex flex-col justify-center" + (!this.props.uneditable && (this.props.isDragging || this.state.isEditMode || this.state.isHovering) ? " min-h-42dpx border-3dpx" : "") + (this.props.overPhone && !this.props.uneditable ? " py-12dpx" : "")}
      style={{
        borderColor: !this.props.uneditable && (this.props.isDragging || this.state.isEditMode || this.state.isHovering) ? this.props.themeColor || theme(this.props.theme).fg : theme(this.props.theme).bg,
        backgroundColor: !this.props.uneditable && (this.props.isDragging || this.state.isEditMode) && theme(this.props.theme).bg || "transparent"
      }}
      onMouseEnter={e => !this.props.uneditable && this.setState({ isEditMode: true, isHovering: true, mouseIsInside: true })}
      onMouseLeave={e => {
        !this.props.uneditable && this.setState({ isEditMode: !this.state.shouldLeave || false, isHovering: !this.state.shouldLeave || false, mouseIsInside: false });
      }}
      >
        {!this.props.uneditable && (
          <span
          className={"block absolute right-0 top-0 flex z-1000" + (!this.props.uneditable ? " cursor-pointer" : "") + ((this.state.isEditMode || this.props.isDragging) ? "" : " hidden pointer-events-none")}
          style={{ backgroundColor: theme(this.props.theme).bg }}
          >
            <img className="h-36dpx w-36dpx p-8dpx opacity-50" src="/assets/move.svg" style={{ filter: this.props.theme === "light" ? "invert()" : "" }} {...this.props.dragHandleProps} />
            <img className="h-36dpx w-36dpx p-8dpx" src="/assets/delete.svg" onClick={() => !this.props.uneditable && this.props.onDelete && this.props.onDelete()} />
          </span>
        )}
        {((): any => {
          let props = {
            theme: this.props.theme,
            isDragging: !this.props.uneditable ? this.props.isDragging : false,
            onEdit: (ev: any) => !this.props.uneditable && this.props.onEdit && this.props.onEdit({ ...this.props.item, ...ev }),
            widthRelPx: this.props.widthRelPx,
            item: this.props.item,
            themeColor: this.props.themeColor,
            isEditMode: !this.props.uneditable ? this.state.isEditMode : false,
            uneditable: this.props.uneditable || false,
            setDraggableState: (ev: boolean) => {
              if (this.props.setDraggableState) this.props.setDraggableState(ev);
              this.setState({ shouldLeave: ev });
              if (!this.state.mouseIsInside && this.state.isEditMode && this.state.isHovering) this.setState({ isEditMode: false, isHovering: false });
            }
          };
          let item: any = {
            "DepictionHeaderView": <HeaderView {...props} />,
            "DepictionSubheaderView": <SubheaderView {...props} />,
            "DepictionSeparatorView": <SeparatorView {...props} />,
            "DepictionSpacerView": <SpacerView {...props} />
          }
          return item[this.props.item.class] || <></>;
        })()}
      </div>
    );
  }
}

export default DepictionClass;