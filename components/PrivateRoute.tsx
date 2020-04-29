import { NextPageContext } from "next";
import Router from 'next/router';
import React, { Component } from "react";
import {host} from "../backend/Helpers/Host";

interface AuthResponse {
  success: Boolean,
  name?: string,
  email?: string,
  verified?: Boolean,
  disabled?: Boolean
}

interface AuthQuery {
  client_id?: string;
  redirect_uri?: string;
  scopes?: string;
}

type PrivateProps = {
  query: AuthQuery,
  response: AuthResponse,
  location: URLSearchParams
};

export function PrivateRoute(WrappedComponent: any) {
  return class extends Component<PrivateProps> {
    state = {
      user: undefined
    };

    componentDidMount() {
      localStorage.setItem("redirect", location.href);
      let token = localStorage.getItem("token");
      if (!token || token === "") return location.href = `${host.self}/oauth2/authorize?redirect_uri=${encodeURIComponent("http://localhost:3000/auth/callback")}&client_id=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfaWQiOiIxIiwiaWF0IjoxNTg3OTQ4NDk3fQ.j3j7nSNuS8_9CpVqxoU6snk4E2taTaK-GGqg1PdI2wA&scopes=email`;
      fetch(`${host.self}/auth/token/verify`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || ""}`
          // 'Content-Type': 'application/x-www-form-urlencoded',
        } // body data type must match "Content-Type" header
      }).then(res => res.json()).then((data) => {
        if (!data.success) {
          localStorage.setItem("token", "");
          console.log(location.href)
          return location.href = `${host.self}/oauth2/authorize?redirect_uri=${encodeURIComponent("http://localhost:3000/auth/callback")}&client_id=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfaWQiOiIxIiwiaWF0IjoxNTg3OTQ4NDk3fQ.j3j7nSNuS8_9CpVqxoU6snk4E2taTaK-GGqg1PdI2wA&scopes=email`;
        }
        this.setState({
          user: data
        });
      });
    }

    render() {
      //lets render the component were wrapping with this privateRoute
      const {...propsWithoutAuth } = this.props;
      if (this.state.user) {
        return <WrappedComponent user={this.state.user} querys={new URLSearchParams(window.location.search)} {...propsWithoutAuth} />;
      }

      return <div></div>;
    }
  };
}