import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import './App.css';
import Homepage from "./pages/homepage/Homepage";
import Admin from "./pages/admin/Admin";
import GamePage from "./pages/game/GamePage";
import MediaPlayer from "./components/mediaPlayerWidgets/mediaPlayerWidgets";
import {PageNotFound} from "./pages/404/pageNotFound";

function Index() {
    return <Homepage/>
}

class App extends Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route path="/" exact component={Index}/>
                    <Route path="/admin" exact component={Admin}/>
                    <Route exact path="/game/:gameId" component={GamePage}/>
                    <Route component={PageNotFound}/>
                </Switch>
                <MediaPlayer/>

            </Router>
        );
    }
}


export default App;