import React from "react";
import Head from "next/head";
import "../public/css/tailwind.css"

function MyApp({Component, pageProps}) {
    return <Component {...pageProps} />
}

export default MyApp;