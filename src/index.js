import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import { App } from './app';
import axios from "axios";


if (process.env.REACT_APP_BACKEND_SERVER_ADDRESS)
  axios.defaults.baseURL = `${process.env.REACT_APP_BACKEND_SERVER_ADDRESS}`;
// else axios.defaults.baseURL = `http://localhost:3000`;
else axios.defaults.baseURL = `https://casper-uniswap-v2-graphql.herokuapp.com/`;

ReactDOM.render(<App />, document.getElementById("root"));

serviceWorker.unregister();
