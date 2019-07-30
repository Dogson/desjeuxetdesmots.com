import React, {Component} from 'react';
import {connect} from 'react-redux';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import './App.css';
import {Homepage} from "./pages/Homepage";
import {ACTIONS_GAMES} from "./actions/gamesActions";

function Index() {
    return <Homepage/>
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        if (!this.props.games || this.props.games.length <= 0) {
            this.props.dispatch({type: ACTIONS_GAMES.SET_GAMES, payload: [{id: "kek", name: "Watch Dogs 2"}]});
        }
        return (
            <Router>
                <Route path="/" exact component={Index}/>
            </Router>
        );
    }
}


const mapStateToProps = state => {
    console.log(state);
    return {
        games: state.gamesReducer.games
    }
};


export default connect(mapStateToProps)(App);