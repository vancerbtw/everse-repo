import React, { Component } from "react";
import Router from "next/router";
import UserHanlder, {Result} from "./UserHandler"

export function privateRoute(WrappedComponent: any) {
  return class extends Component {
    state = {
      userHanlder: new UserHanlder(localStorage.getItem("token") || ""),
      user: undefined
    };

    componentDidMount(): void {
      //lets call to api and check if token is valid and get our user object
      if (localStorage.getItem("token") == "" || !localStorage.getItem("token")) {
          localStorage.removeItem("token")
          Router.push(`/login?redirect=${Router.asPath}`)
        return
      }

      this.state.userHanlder.fetchUser().then((res: Result) => {
        if (!res.valid || !res.user) {
          localStorage.removeItem("token")
          Router.push(`/login?redirect=${Router.asPath}`)
          return
        }

        this.setState({
          user: res.user || {}
        })
      })
    }

    render() {
      //lets render the component were wrapping with this privateRoute
      const {...propsWithoutAuth } = this.props;
      return <WrappedComponent user={this.state.user} {...propsWithoutAuth} />;
    }
  };
}