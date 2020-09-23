import React from "react";
import styles from "../../pages/game/gamePage.module.scss";
import {MEDIA_TYPES} from "../../config/const";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import cx from "classnames";
import Carousel from "../carousel/carousel";
import {ACTIONS_MEDIAS} from "../../actions/mediaActions";
import {findPos} from "../../utils";
import {setGamesForMedia, toggleVerifyMedia} from "../../endpoints/mediasEndpoint";
import {getGameById} from "../../endpoints/gamesEndpoint";
import ActiveMediaBox from "../activeMediaBox/activeMediaBox";

class MediaSection extends React.Component {
    constructor(props) {
        super(props);

        this._handleClickMedia = this._handleClickMedia.bind(this);
        this._handleSaveGames = this._handleSaveGames.bind(this);
        this._handleVerifyMedia = this._handleVerifyMedia.bind(this);
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

    renderActiveMedia(mediaActive) {
        return <ActiveMediaBox media={mediaActive} onSaveGames={this._handleSaveGames}
                               onVerifyMedia={this._handleVerifyMedia}
                               hideDescription={mediaActive.media.type === "video"}/>
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


    renderMediaRow(media) {
        const {mediaActive} = this.props;
        let mediaActiveType;
        if (mediaActive && mediaActive.media) {
            mediaActiveType = MEDIA_TYPES.find(medType => medType.dataLabel === mediaActive.media.type);
        }
        const medias = media.episodes;
        const activeItem = this.props.mediaActive;

        if (medias && medias.length > 0) {
            return <div key={media.name}
                        ref={media.ref}
                        className={cx(styles.mediaRowContainer, {[styles.mediaRowContainerActive]: mediaActive && mediaActive.media && mediaActiveType && media.type === mediaActiveType.dataLabel})}>
                <div className={styles.mediaRowWrapper}>
                    <div className={styles.title}>
                        <img className={styles.imageContainer} src={media.logoMin} alt={media.name}/>
                        {media.name}
                    </div>
                    <Carousel medias={medias}
                              onClickItem={(media, ref) => {
                                  this._handleClickMedia(media, ref)
                              }}
                              activeItem={activeItem}
                              smallerCards={media.type === "video"}/>
                    <div className={styles.activeMediaContainer}>
                        {mediaActive && mediaActive.media && media.name === mediaActive.media.name && this.renderActiveMedia(mediaActive)}
                    </div>
                </div>
            </div>
        }
        return null;
    }

    render() {
        return <div className={styles.gameContentWrapper}>
            <div className={styles.mediaRowContainer}>
                {this.props.medias.map((media) => {
                    return this.renderMediaRow(media);
                })}
            </div>
        </div>
    }

}

const mapStateToProps = state => {
    return {
        mediaActive: state.mediaReducer.mediaActive,
        currentGame: state.gamesReducer.currentGame
    }
};

export default withRouter(connect(mapStateToProps)(MediaSection));
