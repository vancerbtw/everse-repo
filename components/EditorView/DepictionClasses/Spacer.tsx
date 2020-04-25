import React from "react";
import { ResizableBox } from "react-resizable";

import theme from "../../../includes/theme";

class Spacer extends React.Component {
  props: {
    theme: "dark" | "light"
    themeColor?: string,
    widthRelPx: number,
    item: any,
    isDragging: boolean,
    isEditMode: boolean,
    uneditable?: boolean,
    onEdit?: (item: any) => any,
    setDraggableState?: (bool: boolean) => any
  } = this.props

  render() {
    return (
      <div className="p-3dpx">
        {!this.props.uneditable && (this.props.isDragging || this.props.isEditMode) && (
          <div className="pt-14dpx py-10dpx relative flex flex-col items-center">
          <input 
          type="number"
          className="w-84dpx text-16dpx rounded-4dpx px-8dpx py-2dpx mr-auto"
          value={this.props.item.spacing}
          onChange={ev => {
            let ival = ev.currentTarget.valueAsNumber;
            if (ival >= 4 && ival <= 250 && this.props.onEdit) this.props.onEdit({ spacing: Math.min(Math.max(4, Math.ceil(ev.currentTarget.valueAsNumber)), 250) });
          }}
          style={{ backgroundColor: theme(this.props.theme).fg + "10", color: theme(this.props.theme).fg }}
          />
          <ResizableBox
          width={100 * this.props.widthRelPx}
          height={this.props.item.spacing * this.props.widthRelPx}
          minConstraints={[100, 4 * this.props.widthRelPx]}
          maxConstraints={[100, 250 * this.props.widthRelPx]}
          onResizeStart={() => this.props.setDraggableState && this.props.setDraggableState(false)}
          onResizeStop={() => this.props.setDraggableState && this.props.setDraggableState(true)}
          onResize={({}, ev) => {
            if (this.props.onEdit) this.props.onEdit({ spacing: Math.min(Math.max(4, Math.ceil(ev.size.height / this.props.widthRelPx)), 250) });
          }}
          handle={<div className="absolute w-full h-8dpx cursor-pointer opacity-125 bottom-0 rounded-full" style={{ backgroundColor: theme(this.props.theme).fg }} />}
          />
        </div>
        ) || (
          <div className="relative w-full opacity-02 rounded-4dpx" style={{ height: (this.props.item.spacing || 1) * (this.props.widthRelPx || 1), backgroundColor: !this.props.uneditable ? theme(this.props.theme).fg : undefined }} />
        )}
      </div>
    );
  }
}

export default Spacer;