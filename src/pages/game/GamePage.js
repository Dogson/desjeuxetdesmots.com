import styles from "./gamePage.module.scss";
import React from 'react';
import {Helmet} from "react-helmet";
import cx from "classnames";
import {getGameById} from "../../endpoints/gamesEndpoint";
import PageLayout from "../../layouts/PageLayout";
import moment from "moment";
import localization from 'moment/locale/fr';
import {withRouter} from "react-router-dom";
import {LoadingSpinner} from "../../components/loadingSpinner/loadingSpinner";
import Carousel from "../../components/carousel/carousel";
import ActiveMediaBox from "../../components/activeMediaBox/activeMediaBox";
import {connect} from "react-redux";
import {ACTIONS_MEDIAS} from "../../actions/mediaActions";
import {MEDIA_TYPES} from "../../config/const";
import {setGamesForMedia, toggleVerifyMedia} from "../../endpoints/mediasEndpoint";
import {ACTIONS_GAMES} from "../../actions/gamesActions";
import {findPos} from "../../utils";

class GamePage extends React.Component {

    constructor(props) {
        moment.locale('fr', localization);
        super(props);
        this.state = {
            game: {}
        };

        this._handleClickMedia = this._handleClickMedia.bind(this);
        this._handleSaveGames = this._handleSaveGames.bind(this);
        this._handleVerifyMedia = this._handleVerifyMedia.bind(this);
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

    _handleClickMedia(episode, ref) {
        this.props.dispatch({
            type: ACTIONS_MEDIAS.SET_ACTIVE_MEDIA,
            payload: {...episode}
        });
        setTimeout(() => {
            window.scrollTo({top: findPos(ref.current.offsetParent.offsetParent.offsetParent), behavior: 'smooth'})
        }, 200);
    }

    _handleSaveGames(games) {
        return setGamesForMedia({
            games: games.map((game) => {
                const mappedGame = {...game};
                MEDIA_TYPES.forEach((mediaType) => {
                    mediaType.medias.forEach((media) => {
                        mappedGame[media.dataLabel] = null;
                    });
                    if (isNaN(mappedGame.releaseDate))
                        mappedGame.releaseDate = null;
                });
                return mappedGame;
            }),
            mediaType: this.props.mediaActive.media.type,
            mediaId: this.props.mediaActive.media.id
        })
            .then(() => {
                const gameId = String(this.props.match.params.gameId);
                getGameById(gameId)
                    .then((game) => {
                        this.setState({game: game, loading: false});
                    });
                return true;
            })
    }

    _handleVerifyMedia() {
        return toggleVerifyMedia({
            verified: true,
            mediaType: this.props.mediaActive.mediaType,
            mediaId: this.props.mediaActive.media.id
        })
            .then(() => {
                this.setState({
                    medias: this.state.medias.map((media) => {
                        if (media.id === this.props.mediaActive.media.id) {
                            return {...media, isVerified: true};

                        }
                        return media;
                    })
                });
                this.props.dispatch({
                    type: ACTIONS_MEDIAS.SET_ACTIVE_MEDIA,
                    payload: {
                        mediaType: this.props.type.dataLabel,
                        media: {...this.props.mediaActive.media, isVerified: true}
                    }
                });
                return true;
            })
    }

    renderActiveMedia(mediaActive) {
        return <ActiveMediaBox media={mediaActive} onSaveGames={this._handleSaveGames}
                               onVerifyMedia={this._handleVerifyMedia}
                               hideDescription={mediaActive.media.type === "video"}/>
    }

    renderMediaTypeRow(mediaType) {
        const {mediaActive} = this.props;
        let mediaActiveType;
        if (mediaActive && mediaActive.media) {
            mediaActiveType = MEDIA_TYPES.find(medType => medType.dataLabel === mediaActive.media.type);
        }
        const medias = this.props.currentGame.episodes.filter(ep => ep.media.type === mediaType.dataLabel);
        const activeItem = this.props.mediaActive;

        if (medias && medias.length > 0) {
            return <div key={mediaType.dataLabel} ref={mediaType.ref}
                        className={cx(styles.mediaRowContainer, {[styles.mediaRowContainerActive]: mediaActive && mediaActive.media && mediaActiveType && mediaType.dataLabel === mediaActiveType.dataLabel})}>
                <div className={styles.mediaRowWrapper}>
                    <div className={styles.title}>
                        <img className={styles.imageContainer} src={mediaType.logoMin} alt={mediaType.dataLabel}/>
                        {mediaType.name}
                    </div>
                    <Carousel medias={medias}
                              onClickItem={(media, ref) => {
                                  this._handleClickMedia(media, ref)
                              }}
                              onScreenItems={6}
                              activeItem={activeItem}
                              smallerCards={mediaType.dataLabel === "videos"}/>
                    <div className={styles.activeMediaContainer}>
                        {mediaActive && mediaActive.media && mediaType.dataLabel === mediaActiveType.dataLabel && this.renderActiveMedia(mediaActive)}
                    </div>
                </div>
            </div>
        }
        return null;
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

                    <div className={styles.gameContentWrapper}>
                        <div className={styles.gameContent}>
                            {MEDIA_TYPES.map((mediaType) => {
                                return this.renderMediaTypeRow(mediaType);
                            })}
                        </div>
                    </div>
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
