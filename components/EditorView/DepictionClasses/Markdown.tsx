import React from "react";
import ReactMde from "react-mde";
import MarkdownView from 'react-showdown';

class Markdown extends React.Component {
  props: {
    theme: "dark" | "light"
    themeColor?: string,
    widthRelPx: number,
    item: any,
    setDepiction: (depiction: any) => any,
    isDragging: boolean,
    isEditMode: boolean,
    uneditable: boolean,
    onEdit?: (item: any) => any
  } = this.props

  render() {
    return (
      <div className="p-3dpx">
        {!this.props.uneditable && (this.props.isEditMode || this.props.isDragging) && (
          <div className="block px-2dpx py-10dpx relative z-100">
            <ReactMde
              value={this.props.item.markdown}
              onChange={(value) => {
                let item = { ...this.props.item };
                item.markdown = value;
                this.props.setDepiction(item)
              }}
              classes={{
                textArea: this.props.theme === "light" ? "mde-text-light": "mde-text-dark",
                toolbar: this.props.theme === "light" ? "mde-header-light": "mde-header-dark"
              }}
              childProps={{
                writeButton: {
                  tabIndex: -1
                }
              }}
            />
          </div>
        ) || (
          <div className="py-10dpx markdown">
           <MarkdownView markdown={this.props.item.markdown}/>
          </div>
        )}
      </div>
    );
  }
}

export default Markdown;