import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './config/i18n';
import * as themeDefault from './theme/schema.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import { tokenHelper } from 'utils/store-token';
import { COLORS_DEFAULT } from 'utils/constants';
import { LoadingContextProvider } from 'context/loading';

const Index = () => {
  tokenHelper.setColorsToStorage(COLORS_DEFAULT, themeDefault);
  
  return (
    <App />
  );
}

ReactDOM.render(
  // <React.StrictMode>
  <LoadingContextProvider>
    <base href="/" />
    <Index />
  </LoadingContextProvider>,
  // </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
