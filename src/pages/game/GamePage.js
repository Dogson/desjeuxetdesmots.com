import styles from "./gamePage.module.scss";
import React from 'react';
import {Helmet} from "react-helmet";
import {getGameById} from "../../endpoints/gamesEndpoint";
import PageLayout from "../../layouts/PageLayout";
import moment from "moment";
import localization from 'moment/locale/fr';
import {withRouter} from "react-router-dom";
import {LoadingSpinner} from "../../components/loadingSpinner/loadingSpinner";
import {connect} from "react-redux";
import {ACTIONS_MEDIAS} from "../../actions/mediaActions";
import {MEDIA_TYPES} from "../../config/const";
import {ACTIONS_GAMES} from "../../actions/gamesActions";
import MediaSection from "../../components/mediaSection/mediaSection";

class GamePage extends React.Component {

    constructor(props) {
        moment.locale('fr', localization);
        super(props);
        this.state = {
            game: {}
        };
    }

    componentDidMount() {
        this.props.dispatch({
            type: ACTIONS_MEDIAS.SET_ACTIVE_MEDIA,
            payload: {media: null}
        });
        if (!this.props.currentGame || this.props.currentGame._id !== this.props.match.params.gameId) {
            this.refreshGame();
        }
    }

    refreshGame() {
        this.setState({loading: true});
        this.props.dispatch({
            type: ACTIONS_MEDIAS.SET_ACTIVE_MEDIA,
            payload: {media: null}
        });
        const gameId = String(this.props.match.params.gameId);
        getGameById(gameId)
            .then((game) => {
                this.props.dispatch({type: ACTIONS_GAMES.SET_CURRENT_GAME, payload: game});
                this.setState({loading: false});
            })
    }

    sortEpisodesByMediaTypes(episodes) {
        return MEDIA_TYPES.map((type) => {
            return {
                ...type,
                type: type.dataLabel,
                episodes: episodes.filter((episode) => episode.media.type === type.dataLabel)
            }
        })
    }

    render() {
        const {currentGame} = this.props;

        return <PageLayout smallHeader>
            {currentGame && currentGame.name && <Helmet title={`${currentGame.name} - gamer juice`}/>}
            {!currentGame ? <LoadingSpinner/> :
                <div className={styles.gamePageContainer}>
                    <div className={styles.gameHeader}>
                        <div className={styles.backImage} style={{backgroundImage: `url(${currentGame.screenshot})`}}/>
                        <div className={styles.headerContent}>
                            <img className={styles.coverImg} src={currentGame.cover} alt={currentGame.name}/>
                            <div className={styles.gameInfos}>
                                <div className={styles.gameTitle}>
                                    {currentGame.name}
                                </div>
                                <div className={styles.gameDate}>
                                    {moment(currentGame.releaseDate).format('YYYY')}
                                </div>
                            </div>
                        </div>
                    </div>
                    <MediaSection medias={this.sortEpisodesByMediaTypes(currentGame.episodes)}/>
                </div>}
        </PageLayout>
    }
}

const mapStateToProps = state => {
    return {
        mediaActive: state.mediaReducer.mediaActive,
        currentGame: state.gamesReducer.currentGame
    }
};

export default withRouter(connect(mapStateToProps)(GamePage));
