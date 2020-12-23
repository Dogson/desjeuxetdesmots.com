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
import {getAllMedias} from "./endpoints/mediasEndpoint";
import {ACTIONS_MEDIAS} from "./actions/mediaActions";
import {connect} from "react-redux";
import MediaListPage from "./pages/media/MediaListPage";

function Index() {
    return <Homepage/>
}

class App extends Component {
    componentDidMount() {
        getAllMedias()
            .then((medias) => {
                this.props.dispatch({
                    type: ACTIONS_MEDIAS.SET_MEDIAS_LIST,
                    payload: medias
                });
            })
    }

    render() {
        return (
            <Router>
                <Switch>
                    <Route path="/" exact component={withTracker(Index)}/>
                    <Route path="/admin" exact component={withTracker(Admin)}/>
                    <Route exact path="/game/:gameId" component={withTracker(GamePage)}/>
                    <Route exact path="/media" component={withTracker(MediaListPage)}/>
                    <Route exact path="/media/:mediaName" component={withTracker(MediaPage)}/>
                    <Route component={withTracker(PageNotFound)}/>
                </Switch>
                <MediaPlayer/>

            </Router>
        );
    }
}


export default connect()(App);