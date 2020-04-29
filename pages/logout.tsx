import react from "react";

export default class Logout extends react.Component {
  componentDidMount() {
    localStorage.removeItem("token");

    const queries = new URLSearchParams(location.search);

    return location.href = queries.get("redirect") || "/";
  }

  render() {
    return <></>
  }
}