import React from "react";

import theme from "../../../includes/theme";

class Subheader extends React.Component {
  props: {
    theme: "dark" | "light"
    themeColor?: string,
    widthRelPx: number,
    item: any,
    isDragging: boolean,
    isEditMode: boolean,
    uneditable: boolean,
    onEdit?: (item: any) => any
  } = this.props

  render() {
    return (
      <div className="p-3dpx">
        {!this.props.uneditable && (this.props.isEditMode || this.props.isDragging) && (
          <div className="block px-2dpx py-10dpx">
            <div className="flex flex-row mb-8dpx">
              <span
              className="fas fa-bold px-12dpx py-2dpx cursor-pointer text-16dpx"
              style={{ opacity: this.props.item.useBoldText ? 1 : 0.4 }}
              onClick={ev => this.props.onEdit && this.props.onEdit({ useBoldText: !this.props.item.useBoldText })}
              />
            </div>
            <input
            placeholder="Text goes here..."
            value={this.props.item.title}
            autoFocus={true}
            style={{
              backgroundColor: theme(this.props.theme).fg + "10"
            }}
            onChange={ev => this.props.onEdit && this.props.onEdit({ title: ev.currentTarget.value })}
            className={
              "bg-transparent border-none text-20dpx max-w-full px-8dpx py-2dpx rounded-4dpx min-w-full"
              + (this.props.item.useBoldText ? " font-bold" : "")
            }
            />
          </div>
        ) || (
          <div className="py-16dpx">
            <p
            className={
              "text-20dpx max-w-full truncate opacity-50 font-display font-regular"
              + (this.props.item.useBoldText ? " font-bold opacity-100" : " opacity-50")
              + ((this.props.item.title || {}).length > 0 ? "" : " opacity-25")
            }
            >
              {(this.props.item.title || {}).length > 0 ? this.props.item.title : "Text goes here..."}
            </p>
          </div>
        )}
      </div>
    );
  }
}

export default Subheader;