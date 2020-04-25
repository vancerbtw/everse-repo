import React from "react";

class PhoneFrame extends React.Component {
  props: {
    dark?: boolean
    children: any
    style?: any
  } = this.props

  frame (src: string, cond: boolean) {
    return <img
    className="relative max-w-full z-100 pointer-events-none max-h-full border-none user-select-none"
    src={src}
    style={{ display: cond ? "block" : "none" }}
    alt=" "
    />
  }

  render() {
    return (
      <div className="block" style={this.props.style}>
        <div className="inline-block relative w-full z-100 overflow-hidden" style={{ maxWidth: 576 }}>
          {this.frame("/assets/iPX-Transparent@3.33x.png", !this.props.dark)}
          {this.frame("/assets/iPX-Dark-Transparent@3.33x.png", !!this.props.dark)}
          <div
          className="absolute w-full z-99 overflow-hidden h-full"
          style={{
            top: "2.9%",
            left: "6.5%",
            maxHeight: "94.3%",
            maxWidth: "87%",
            mask: "url(/assets/iPX-Screen@3.33x.png)",
            maskSize: "100% 100%",
            maskPosition: "center" }}
          >
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

export default PhoneFrame;

