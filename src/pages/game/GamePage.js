import styles from "./gamePage.module.scss";
import React, {Component} from 'react';
import {Helmet} from "react-helmet";
import cx from "classnames";
import {getGameById} from "../../endpoints/gamesEndpoint";
import PageLayout from "../../layouts/PageLayout";
import moment from "moment";
import localization from 'moment/locale/fr';
import {NavLink, withRouter} from "react-router-dom";
import {LoadingSpinner} from "../../components/loadingSpinner/loadingSpinner";
import Carousel from "../../components/carousel/carousel";
import ActiveMediaBox from "../../components/activeMediaBox/activeMediaBox";
import {connect} from "react-redux";
import {ACTIONS_MEDIAS} from "../../actions/mediaActions";
import {MEDIA_TYPES} from "../../config/const";
import {setGamesForMedia, toggleVerifyMedia} from "../../endpoints/mediasEndpoint";
import {TrashWidget} from "../../components/trashWidget/trashWidget";

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
        this.refreshGame();
    }

    componentDidUpdate(prevProps) {
        if (this.props.match.params.gameId !== prevProps.match.params.gameId) {
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
                this.setState({game: game, loading: false});
            })
    }

    _handleClickMedia(media) {
        this.props.dispatch({
            type: ACTIONS_MEDIAS.SET_ACTIVE_MEDIA,
            payload: {media: media}
        });
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

    renderActiveMedia(mediaActive, appType) {
        return <ActiveMediaBox media={mediaActive.media} onSaveGames={this._handleSaveGames}
                               onVerifyMedia={this._handleVerifyMedia} app={appType}
                               hideDescription={appType === "youtube"}/>
    }

    renderMediaTypeRow(mediaType) {
        const {mediaActive} = this.props;
        let appType = "";
        let mediaActiveType = "";
        if (mediaActive && mediaActive.media) {
            MEDIA_TYPES.forEach((mediaType) => {
                mediaType.medias.forEach((media) => {
                    if (media.dataLabel === mediaActive.media.type) {
                        appType = media.app;
                        mediaActiveType = mediaType.dataLabel;
                    }
                })
            });
        }
        const medias = this.state.game[mediaType.dataLabel];
        const activeItem = this.props.mediaActive && this.props.mediaActive.media;

        if (medias && medias.length > 0) {
            return <div key={mediaType.dataLabel}
                        className={cx(styles.mediaRowContainer, {[styles.mediaRowContainerActive]: mediaActive && mediaActive.media && mediaType.dataLabel === mediaActiveType})}>
                <div className={styles.mediaRowWrapper}>
                    <div className={styles.title}>
                        <img className={styles.imageContainer} src={mediaType.logoMin}/>
                        {mediaType.name}
                    </div>
                    <Carousel medias={medias}
                              onClickItem={this._handleClickMedia}
                              onScreenItems={6}
                              activeItem={activeItem}
                              smallerCards={mediaType.dataLabel === "videos"}/>
                    {mediaActive && mediaActive.media && mediaType.dataLabel === mediaActiveType && this.renderActiveMedia(mediaActive, appType)}
                </div>
            </div>
        }
        return null;
    }

    render() {
        const {game, loading} = this.state;
        return <PageLayout smallHeader>
            {game && game.name && <Helmet title={`${game.name} - gamer juice`}/>}
            {loading ? <LoadingSpinner/> :
                <div className={styles.gamePageContainer}>
                    <div className={styles.gameHeader}>
                        <div className={styles.backImage} style={{backgroundImage: `url(${game.screenshot})`}}/>
                        <div className={styles.headerContent}>
                            <img className={styles.coverImg} src={game.cover}/>
                            <div className={styles.gameInfos}>
                                <div className={styles.gameTitle}>
                                    {game.name}
                                </div>
                                <div className={styles.gameDate}>
                                    {moment.unix(game.releaseDate).format('YYYY')}
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
        mediaActive: state.mediaReducer.mediaActive
    }
};

export default withRouter(connect(mapStateToProps)(GamePage));
