import type { AppProps } from 'next/app'
import reportWebVitals from '../reportWebVitals';

import '../styles/bootstrapOverrides.scss';
import '../styles/index.scss';
import '../styles/simpleKeyboardOverrides.scss';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

export default MyApp;