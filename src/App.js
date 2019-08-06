import React, {Component} from 'react';
import {connect} from 'react-redux';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import './App.css';
import Homepage from "./pages/homepage/Homepage";
import Admin from "./pages/admin/Admin";
import {ACTIONS_GAMES} from "./actions/gamesActions";

function Index() {
    return <Homepage/>
}

class App extends Component {
    render() {
        return (
            <Router>
                <Route path="/" exact component={Index}/>
                <Route path="/admin" exact component={Admin}/>
            </Router>
        );
    }
}


export default App;