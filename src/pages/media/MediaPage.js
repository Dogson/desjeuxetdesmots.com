import React from "react";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import styles from "./mediaPage.module.scss";
import PageLayout from "../../layouts/PageLayout";
import {Helmet} from "react-helmet";
import {getMedia} from "../../endpoints/mediasEndpoint";
import {ACTIONS_MEDIAS} from "../../actions/mediaActions";
import {getGamesBySearch} from "../../endpoints/gamesEndpoint";
import {ACTIONS_GAMES} from "../../actions/gamesActions";
import GameGridContainer from "../../components/gameGrid/gameGrid";

class MediaPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: false
        };
    }

    componentDidMount() {
        const {currentMedia} = this.props;
        const {mediaName} = this.props.match.params;

        if (!currentMedia || currentMedia.name !== mediaName) {
            this.refreshMedia();
            this.refreshGames();
        }
    }

    componentWillUnmount() {
        this.props.dispatch({
            type: ACTIONS_MEDIAS.SET_CURRENT_MEDIA,
            payload: null
        });
        this.props.dispatch({
            type: ACTIONS_MEDIAS.SET_CURRENT_MEDIA,
            payload: null
        });
    }

    async refreshMedia() {
        this.props.dispatch({
            type: ACTIONS_MEDIAS.SET_CURRENT_MEDIA,
            payload: null
        });
        const {mediaName} = this.props.match.params;
        const media = await getMedia(mediaName);
        this.props.dispatch({
            type: ACTIONS_MEDIAS.SET_CURRENT_MEDIA,
            payload: media
        });
    }

    async refreshGames() {
        const {mediaName} = this.props.match.params;
        const games = await getGamesBySearch({"media.name": mediaName});
        this.props.dispatch({
            type: ACTIONS_GAMES.SET_GAMES,
            payload: games
        })
    }

    renderCurrentMedia() {
        return <div className={styles.mediaPageContainer}>
            {this.renderMediaTitle()}
            {this.renderGameGrid()}
        </div>
    }

    renderMediaTitle() {
        const {currentMedia} = this.props;
        const {mediaName} = this.props.match.params;

        return <div className={styles.mediaTitleContainer}>
            <div className={styles.mediaLogo}>
                {currentMedia && <img src={currentMedia.logo} alt={currentMedia.name}/>}
            </div>
            <div className={styles.mediaName}>
                {mediaName}
            </div>
            <div className={styles.epNumber}>
                {currentMedia && currentMedia.total} {currentMedia && (currentMedia.type === "video" ? "vidéos" : "épisodes")}
            </div>
        </div>
    }

    renderGameGrid() {
        console.log(this.props);
        const {games} = this.props;
        return <GameGridContainer games={games} disableLogo/>
    }

    render() {
        const {currentMedia} = this.props;
        return <PageLayout smallHeader>
            {currentMedia && currentMedia.name && <Helmet title={`${currentMedia.name} - Des jeux et des mots`}/>}
            {this.renderCurrentMedia()}
        </PageLayout>
    }
}

const mapStateToProps = state => {
    return {
        currentMedia: state.mediaReducer.currentMedia,
        games: state.gamesReducer.games
    }
}

export default withRouter(connect(mapStateToProps)(MediaPage));