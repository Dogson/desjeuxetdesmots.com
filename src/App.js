import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import './App.css';
import Homepage from "./pages/homepage/Homepage";
import Admin from "./pages/admin/Admin";
import GamePage from "./pages/game/GamePage";
import MediaPlayer from "./components/mediaPlayerWidgets/mediaPlayerWidgets";
import {PageNotFound} from "./pages/404/pageNotFound";
import withTracker from "./components/withTracker/withTracker";
import {getAllMedias} from "./endpoints/mediasEndpoint";
import {ACTIONS_MEDIAS} from "./actions/mediaActions";
import {connect} from "react-redux";
import {ACTIONS_SETTINGS} from "./actions/settingsActions";

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
                const filters = {}
                medias.forEach(media => {
                    filters[media.name] = true;
                });
                this.props.dispatch({
                    type: ACTIONS_SETTINGS.SET_FILTERED_VALUES,
                    payload: {medias: filters}
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
                    <Route component={withTracker(PageNotFound)}/>
                </Switch>
                <MediaPlayer/>

            </Router>
        );
    }
}


export default connect()(App);