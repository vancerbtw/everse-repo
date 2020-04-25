import React from "react";

class Logo extends React.Component {
  props: {
    dark?: boolean
  } = this.props;

  render() {
    return <a style={{ backgroundImage: "url(/assets/logo-light.svg)", filter: this.props.dark ? "invert()" : "" }} className="inline-block absolute m-2 leading-10 pl-12 opacity-25 text-white bg-left bg-contain bg-no-repeat transition text-base uppercase font-bold select-none">Depiction Designer</a>;
  }
}

export default Logo;
