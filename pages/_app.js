import '../styles/index.css';
import "react-mde/lib/styles/css/react-mde-all.css";

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}