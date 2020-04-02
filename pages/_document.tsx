import React from "react";
import Document, {Html, Main, NextScript, Head} from "next/document";

export default class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx);
        return {...initialProps}
    }

    render() {
        return (
            <Html lang='en-US'>
                <Head>
                    <meta name="theme-color" content="#04A292"/>
                    <meta name="description" content="Everse repo, your one stop for perfect tweaks."/>
                    <link rel="shortcut icon" href="/favicon.ico"/>
                    <link rel="apple-touch-icon" href="/favicon.ico"/>
                    <link rel="icon" href="/favicon.ico" />
                    <link href="/OpenSans-Bold.ttf" rel="stylesheet"/>
                </Head>
                <body className={"dark:bg-black dark:text-white font-sans"}>
                    <Main/>
                    <NextScript/>
                </body>
            </Html>
        )
    }
}