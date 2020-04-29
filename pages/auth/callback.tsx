import React from "react";
import ViewLoader from "../../components/ViewLoader";
import { host } from "../../backend/Helpers/Host";
import Head from 'next/head'

interface DepictionView {
  class: string;
  title: string;
};

interface DepictionTab {
  tabname: string;
  class: string;
  views: DepictionView[];
}

interface verifyResponse { 
  success: Boolean, 
  error?: string, 
  session: { email: string, username: string, developer: Boolean } 
}

type DepictionProps = {};

type DepictionState = {

};

export default class Depiction extends React.Component<DepictionProps, DepictionState> {
  constructor(props: any) {
    super(props);
  }

  componentDidMount() {
    const queries = new URLSearchParams(location.search);
    if (queries.get("code") === "" || !queries.get("code")) return;
    localStorage.setItem("token", queries.get("code") || "");

    return location.href = localStorage.getItem("redirect") || "";
  }

  render() {
    return (<div></div>);
  }
}