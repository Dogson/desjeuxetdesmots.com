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
import {MEDIA_TYPES} from "../../config/const";
import {ACTIONS_GAMES} from "../../actions/gamesActions";
import MediaSection from "../../components/mediaSection/mediaSection";
import {ErrorMessage} from "../../components/errorMessage/errorMessage";
import {ACTIONS_MEDIAS} from "../../actions/mediaActions";
import {isEqual} from "lodash";

class GamePage extends React.Component {

    constructor(props) {
        moment.locale('fr', localization);
        super(props);
        this.state = {
            game: {},
            loading: false,
            error: false
        };
    }

    componentDidMount() {
        if (!this.props.currentGame || this.props.currentGame._id !== this.props.match.params.gameId) {
            this.refreshGame();
        } else {
            window.scrollTo({top: 0, behavior: "auto"});
            this.props.dispatch({
                type: ACTIONS_MEDIAS.SET_ACTIVE_EPISODE,
                payload: null
            });
            this.props.dispatch({
                type: ACTIONS_MEDIAS.SET_EPISODES_LIST,
                payload: this.sortEpisodesByMediaTypes(this.props.currentGame.episodes)
            });
        }
    }

    componentDidUpdate(prevProps) {
        if (this.state.loading || this.state.error)
            return;
        if (!this.props.currentGame || this.props.currentGame._id !== this.props.match.params.gameId) {
            this.refreshGame();
        }
        if (!isEqual(this.props.settings.filters.medias, prevProps.settings.filters.medias)) {
            this.refreshGame();
            this.props.dispatch({type: ACTIONS_GAMES.SET_GAMES, payload: {games: [], page: 1}});
        }
    }

    refreshGame() {
        window.scrollTo({top: 0, behavior: 'auto'});
        this.props.dispatch({
            type: ACTIONS_MEDIAS.SET_ACTIVE_EPISODE,
            payload: null
        });
        const gameId = String(this.props.match.params.gameId);

        if (this.props.location.game) {
            this.props.dispatch({type: ACTIONS_GAMES.SET_CURRENT_GAME, payload: this.props.location.game});
            this.props.dispatch({
                type: ACTIONS_MEDIAS.SET_EPISODES_LIST,
                payload: this.sortEpisodesByMediaTypes(this.props.location.game.episodes)
            });
        } else {
            this.setState({loading: true, error: false});
            getGameById(gameId)
                .then((game) => {
                    this.props.dispatch({type: ACTIONS_GAMES.SET_CURRENT_GAME, payload: game});
                    this.props.dispatch({
                        type: ACTIONS_MEDIAS.SET_EPISODES_LIST,
                        payload: this.sortEpisodesByMediaTypes(game.episodes)
                    });
                })
                .catch((err) => {
                    const is404 = err.toJSON().message.indexOf("404") > -1;
                    this.setState({error: is404 ? "Aucun jeu ne correspond à cette URL." : "Une erreur est survenue lors du chargement des médias"});

                })
                .then(() => {
                    this.setState({loading: false});
                })
        }
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
        const {error} = this.state;

        return <PageLayout smallHeader>
            {currentGame && currentGame.name && <Helmet title={`${currentGame.name} : Vidéos et podcasts - Des jeux et des mots`}/>}
            {!currentGame ?
                error ?
                    <ErrorMessage>{error}</ErrorMessage> :
                    <LoadingSpinner/>
                :
                <div className={styles.gamePageContainer}>
                    <div className={styles.gameHeader}>
                        <div className={styles.backImage} style={{backgroundImage: `url(${currentGame.screenshot})`}}/>
                        <div className={styles.headerContent}>
                            <img className={styles.coverImg} src={currentGame.cover} alt={currentGame.name}/>
                            <div className={styles.gameInfos}>
                                <div className={styles.gameTitle}>
                                    {currentGame.name}
                                </div>
                                <div className={styles.gameDevelopers}>
                                    {currentGame.companies.map((comp, index) => {
                                        return <span key={comp.name}>{comp.name}{index < currentGame.companies.length - 1 && ", "}</span>
                                    })}
                                </div>
                                <div className={styles.gameDate}>
                                    {currentGame.formattedDate}
                                </div>
                            </div>
                        </div>
                    </div>
                    {error && <ErrorMessage>Une erreur est survenue lors du chargement des médias</ErrorMessage>}
                    <MediaSection rowAttribute="type"/>
                </div>}
        </PageLayout>
    }
}

const mapStateToProps = state => {
    return {
        episodeActive: state.mediaReducer.episodeActive,
        currentGame: state.gamesReducer.currentGame,
        settings: state.settingsReducer.settings,
    }
};

export default withRouter(connect(mapStateToProps)(GamePage));
