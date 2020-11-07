import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import './App.css';
import Homepage from "./pages/homepage/Homepage";
import Admin from "./pages/admin/Admin";
import GamePage from "./pages/game/GamePage";
import MediaPage from "./pages/media/MediaPage";
import MediaPlayer from "./components/mediaPlayerWidgets/mediaPlayerWidgets";
import {PageNotFound} from "./pages/404/pageNotFound";
import withTracker from "./components/withTracker/withTracker";

function Index() {
    return <Homepage/>
}

class App extends Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route path="/" exact component={withTracker(Index)}/>
                    <Route path="/admin" exact component={withTracker(Admin)}/>
                    <Route exact path="/game/:gameId" component={withTracker(GamePage)}/>
                    <Route exact path="/media/:mediaId" component={withTracker(MediaPage)}/>
                    <Route component={withTracker(PageNotFound)}/>
                </Switch>
                <MediaPlayer/>

            </Router>
        );
    }
}


export default App;