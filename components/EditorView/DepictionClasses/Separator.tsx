import React from "react";

import theme from "../../../includes/theme";

class Separator extends React.Component {
  props: {
    theme: "dark" | "light"
    themeColor?: string,
    widthRelPx: number,
    item: any,
    isDragging: boolean,
    isEditMode: boolean,
    onEdit?: (item: any) => any
  } = this.props

  render() {
    return (
      <div>
        <div className="px-2dpx h-full py-1dpx">
          <span className="w-full block opacity-125" style={{ backgroundColor: theme(this.props.theme).fg, height: "calc(2px * var(--dpx))" }} />
        </div>
      </div>
    );
  }
}

export default Separator;