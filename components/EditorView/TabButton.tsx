import react from "react";

export default class Tab extends react.Component {
  props: {
    el: any
    activeTab: any
    super: any
    index: number
    tintColor: string
    widthRelPx: number
  } = this.props;

  state: any = {
    rendered: false
  }

  componentWillUpdate() {
    if (this.props.index !== this.props.activeTab || this.state.rendered) return;
    this.setState({
      rendered: true
    })

    this.props.super.setState({
      activeTab: this.props.index,
      indicatorLeft: this.state.offsetLeft / this.state.widthRelPx,
      indicatorWidth: this.state.clientWidth / this.state.widthRelPx,
      indicatorLeftCalc: this.state.offsetLeft,
      indicatorWidthCalc: this.state.clientWidth 
    })
  }

  ref: { [x: string]: { current: HTMLElement } } = {
    MainView: react.createRef(),
    StartTab: react.createRef(),
  } as any

  render() {
    return (
      <div
      className="cursor-pointer text-23dpx block relative pt-0 pb-10dpx px-6dpx opacity-35 hover:opacity-50 transition-all ease-out duration-75 font-text"
      key={"TabList_" + this.props.el.tabname}
      {...(this.props.index === this.props.activeTab && { ref: this.ref.StartTab } || {}) as any}
      onLoad={elm => {
        if (this.state.activeTab != this.props.index) return;
      }}
      onClick={elm => this.setState({
        activeTab: this.props.index,
        elm
      })}
      style={{ ...(this.state.activeTab === this.props.el.tabname && { color: this.props.tintColor, opacity: 1 } || {}) }}
      >
        {this.props.el.tabname}
      </div>
    )
  }
}