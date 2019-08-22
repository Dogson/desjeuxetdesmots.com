import styles from "./gamePage.module.scss";
import React, {Component} from 'react';
import {Helmet} from "react-helmet";
import {getGameById} from "../../endpoints/gamesEndpoint";
import PageLayout from "../../layouts/PageLayout";
import moment from "moment";
import localization from 'moment/locale/fr';
import {NavLink, withRouter} from "react-router-dom";
import {LoadingSpinner} from "../../components/loadingSpinner/loadingSpinner";
import Carousel from "../../components/carousel/carousel";
import {AdminMediaBox} from "../../components/adminMedia/adminMediaBox";
import {connect} from "react-redux";
import {ACTIONS_MEDIAS} from "../../actions/mediaActions";
import {MEDIA_TYPES} from "../../config/const";
import {setGamesForMedia, toggleVerifyMedia} from "../../endpoints/mediasEndpoint";

class GamePage extends React.Component {

    constructor(props) {
        moment.locale('fr', localization);
        super(props);
        this.state = {
            game: {},
            loading: true
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
        const gameId = String(this.props.match.params.gameId);
        getGameById(gameId)
            .then((game) => {
                this.setState({game: game, loading: false});
            })
    }

    _handleClickMedia(media) {
        console.log(media);
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

    renderActiveMedia() {
        debugger;
        const {mediaActive, type} = this.props;
        if (mediaActive && mediaActive.media)
            return <AdminMediaBox media={mediaActive.media} onSaveGames={this._handleSaveGames}
                                  onVerifyMedia={this._handleVerifyMedia}/>
    }

    renderMediaTypeRow(mediaType) {
        const medias = this.state.game[mediaType.dataLabel];
        const activeItem = this.props.mediaActive && this.props.mediaActive.media;
        if (medias && medias.length > 0) {
            return <div key={mediaType.dataLabel}>
                <div className={styles.title}>
                    <img className={styles.imageContainer} src={mediaType.logoMin}/>
                    {mediaType.name}
                </div>
                <Carousel medias={medias}
                          onClickItem={this._handleClickMedia}
                          onScreenItems={6}
                          activeItem={activeItem}/>
                {this.renderActiveMedia()}
            </div>
        }
        return null;
    }

    render() {
        const {game, loading} = this.state;
        return <PageLayout smallHeader>
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
