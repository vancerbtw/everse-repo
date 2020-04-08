import "../css/sileo.css";
import React from "react";
import PropTypes from "prop-types";

interface Comp {
  // any other props that come into the component
}

const MyApp = ( Component: React.ComponentType, pageProps: any) => (
  <Component {...pageProps} />
)

export default MyApp