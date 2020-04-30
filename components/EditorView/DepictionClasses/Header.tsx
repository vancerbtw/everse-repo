import React from "react";

import theme from "../../../includes/theme";

class Header extends React.Component {
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
              <span
              className="fas fa-align-left px-12dpx py-2dpx cursor-pointer text-16dpx"
              style={{ opacity: (this.props.item.alignment === 0 || this.props.item.alignment === undefined) ? 1 : 0.4 }}
              onClick={ev => this.props.onEdit && this.props.onEdit({ alignment: 0 })}
              />
              <span
              className="fas fa-align-center px-12dpx py-2dpx cursor-pointer text-16dpx"
              style={{ opacity: (this.props.item.alignment === 1) ? 1 : 0.4 }}
              onClick={ev => this.props.onEdit && this.props.onEdit({ alignment: 1 })}
              />
              <span
              className="fas fa-align-right px-12dpx py-2dpx cursor-pointer text-16dpx"
              style={{ opacity: (this.props.item.alignment === 2) ? 1 : 0.4 }}
              onClick={ev => this.props.onEdit && this.props.onEdit({ alignment: 2 })}
              />
            </div>
            <input
            placeholder="Text goes here..."
            value={this.props.item.title}
            autoFocus={true}
            style={{
              textAlign: (this.props.item.alignment === 1) && "center" || (this.props.item.alignment === 2) && "right" || "left",
              backgroundColor: theme(this.props.theme).fg + "10"
            }}
            onChange={ev => this.props.onEdit && this.props.onEdit({ title: ev.currentTarget.value })}
            className={
              "bg-transparent border-none text-29dpx max-w-full px-8dpx py-2dpx rounded-4dpx"
              + (this.props.item.useBoldText ? " font-bold" : "")
            }
            />
          </div>
        ) || (
          <div className="py-10dpx">
            <p
            className={
              "text-29dpx max-w-full truncate"
              + (this.props.item.useBoldText ? " font-bold" : "")
              + ((this.props.item.title || {}).length > 0 ? "" : " opacity-50")
            }
            style={{ textAlign: (this.props.item.alignment === 1) && "center" || (this.props.item.alignment === 2) && "right" || "left" }}
            >
              {(this.props.item.title || {}).length > 0 ? this.props.item.title : "Text goes here..."}
            </p>
          </div>
        )}
      </div>
    );
  }
}

export default Header;