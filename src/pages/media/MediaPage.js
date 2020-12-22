import React from "react";
import linkifyHtml from 'linkifyjs/html'
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import styles from "./mediaPage.module.scss";
import PageLayout from "../../layouts/PageLayout";
import {Helmet} from "react-helmet";
import {getMedia} from "../../endpoints/mediasEndpoint";
import {ACTIONS_MEDIAS} from "../../actions/mediaActions";
import GameGridContainer from "../../components/gameGrid/gameGrid";
import cx from "classnames";
import {ACTIONS_GAMES} from "../../actions/gamesActions";
import {LoadingSpinner} from "../../components/loadingSpinner/loadingSpinner";

class MediaPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: false
        };
    }

    componentDidMount() {
        window.scrollTo({top: 0, behavior: "auto"});
        const {currentMedia} = this.props;
        const {mediaName} = this.props.match.params;

        if (!currentMedia || currentMedia.name !== mediaName) {
            this.refreshMedia()
                .then(() => {
                    this.refreshGames();
                });


        }
    }

    componentWillUnmount() {
        this.props.dispatch({
            type: ACTIONS_MEDIAS.SET_CURRENT_MEDIA,
            payload: null
        });
        this.props.dispatch({
            type: ACTIONS_GAMES.SET_GAMES,
            payload: {games: [], page: 1}
        });
        this.props.dispatch({type: ACTIONS_MEDIAS.SET_SEARCHED_MEDIAS, payload: []});


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
        this.props.dispatch({
            type: ACTIONS_GAMES.SET_GAMES,
            payload: {games: null}
        });
        this.props.dispatch({type: ACTIONS_MEDIAS.SET_SEARCHED_MEDIAS, payload: []});
    }

    renderCurrentMedia() {
        return <div className={styles.mediaPageContainer}>
            {this.renderMediaTitle()}
            {this.props.currentMedia ?
                this.renderGameGrid() :
                <LoadingSpinner/>}
        </div>
    }

    renderDescription(description) {
        return <div className={styles.mediaDescription}
                    dangerouslySetInnerHTML={{__html: linkifyHtml(description.replace(/\n{3,}/g, "\n\n"))}}>
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
            {currentMedia && this.renderDescription(currentMedia.description)}
            {currentMedia && this.renderExternalLink()}
        </div>
    }

    renderExternalLink() {
        const {currentMedia} = this.props;
        if (currentMedia.type === "video") {
            const youtubeChannelId = currentMedia.feedUrl.split("channel_id=")[1];
            const youtubeChannelUrl = `https://www.youtube.com/channel/${youtubeChannelId}`;
            return <div className={styles.subscribeBtn}>
                <a className={cx(styles.btn)}
                   href={youtubeChannelUrl}>Accéder à la chaîne Youtube
                </a>
            </div>
        } else {
            return <div className={styles.subscribeBtn}>
                <a className={cx(styles.btn, styles.mobile)}
                   href={`podcast://${currentMedia.feedUrl}`}>S'abonner avec votre app de podcasts
                </a>
                <a className={cx(styles.btn, styles.desktop)}
                   href={currentMedia.feedUrl}>Accéder au flux RSS du podcast
                </a>
            </div>
        }
    }

    renderGameGrid() {
        return <GameGridContainer disableLogo disableSearch disableMediasSummary/>
    }

    render() {
        const {currentMedia} = this.props;
        return <PageLayout smallHeader dark>
            {currentMedia && currentMedia.name && <Helmet defer={false}
                title={`${currentMedia.name} : ${currentMedia.type === "video" ? "Vidéos" : "Podcasts"} -  Des jeux et des mots`}/>}
            {this.renderCurrentMedia()}
        </PageLayout>
    }
}

const mapStateToProps = state => {
    return {
        currentMedia: state.mediaReducer.currentMedia,
    }
}

export default withRouter(connect(mapStateToProps)(MediaPage));