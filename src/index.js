import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux'
import configureStore from './store';
import "./index.scss";
import App from './App';
import * as serviceWorker from './serviceWorker';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

ReactDOM.render(
    <Provider store={configureStore()}>
        <App/>
    </Provider>,
    document.getElementById('root')
);

serviceWorker.register();