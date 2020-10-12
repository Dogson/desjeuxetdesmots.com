import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux'
import "./index.scss";
import App from './App';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import store from "./store";

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root')
);