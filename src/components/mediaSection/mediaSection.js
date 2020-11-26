import React from "react";
import styles from "./mediaSection.module.scss";
import {MEDIA_TYPES} from "../../config/const";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import cx from "classnames";
import Carousel from "../carousel/carousel";
import {ACTIONS_MEDIAS} from "../../actions/mediaActions";
import {findPos} from "../../utils";
import {setGamesForMedia, toggleVerifyMedia} from "../../endpoints/mediasEndpoint";
import ActiveMediaBox from "../activeMediaBox/activeMediaBox";
import {LoadingSpinner} from "../loadingSpinner/loadingSpinner";

class MediaSection extends React.Component {
    constructor(props) {
        super(props);

        this._handleClickMedia = this._handleClickMedia.bind(this);
        this._handleSaveGames = this._handleSaveGames.bind(this);
        this._handleVerifyMedia = this._handleVerifyMedia.bind(this);
        this._handleCloseMedia = this._handleCloseMedia.bind(this);
    }

    _handleClickMedia(episode, ref) {
        this.props.dispatch({
            type: ACTIONS_MEDIAS.SET_ACTIVE_MEDIA,
            payload: {...episode}
        });
        setTimeout(() => {
            window.scrollTo({top: findPos(ref.current).top - 10, behavior: 'smooth'})
        }, 0);
    }

    _handleSaveGames(games) {
        return setGamesForMedia({
            games,
            episodeId: this.props.mediaActive._id
        })
            .then((result) => {
                this.saveMedia(result);
            })
    }

    _handleVerifyMedia() {
        return toggleVerifyMedia({
            verified: true,
            episodeId: this.props.mediaActive._id
        })
            .then((newMedia) => {
                this.saveMedia(newMedia);
            });
    }

    _handleCloseMedia() {
        this.props.dispatch({
            type: ACTIONS_MEDIAS.SET_ACTIVE_MEDIA,
            payload: null
        });
    }

    goToNextMedia() {
        let episodes = [];
        this.props.medias.forEach((media) => {
            if (media.name === this.props.mediaActive.media.name) {
                episodes = media.episodes;
            }
        })
        const mappedMedia = episodes.map(media => media.name);
        const currentMediaIndex = mappedMedia.findIndex((media) => {
            return media === this.props.mediaActive.name
        });
        const nextMedia = episodes[currentMediaIndex + 1];
        this.props.dispatch({
            type: ACTIONS_MEDIAS.SET_ACTIVE_MEDIA,
            payload: nextMedia
        });
    }

    saveMedia(newMedia) {
        const {medias} = this.props;
        const updatedMedias = medias.map((media) => {
            media.episodes = media.episodes.map((episode) => {
                if (episode._id === newMedia._id) {
                    return {...newMedia, verified: true};
                }
                return episode;
            });
            return media;
        });
        this.props.dispatch({
            type: ACTIONS_MEDIAS.SET_MEDIAS_LIST,
            payload: updatedMedias
        });
        this.goToNextMedia();
    }

    renderActiveMedia(mediaActive, ref) {
        return <div ref={ref}><ActiveMediaBox media={mediaActive} onSaveGames={this._handleSaveGames}
                                              onVerifyMedia={this._handleVerifyMedia}
                                              onCloseMedia={this._handleCloseMedia}
                                              smallVideo={this.props.smallVideo}
        /></div>
    }

    renderMediaRow(media) {
        const {mediaActive, rowAttribute} = this.props;
        let mediaActiveType;
        if (mediaActive && mediaActive.media) {
            mediaActiveType = MEDIA_TYPES.find(medType => medType.dataLabel === mediaActive.media.type);
        }
        const medias = media.episodes;
        const activeItem = this.props.mediaActive;
        if (medias && medias.length > 0) {
            return <div key={media.name}
                        className={cx(styles.mediaRowContainer, {[styles.mediaRowContainerActive]: mediaActive && mediaActive.media && mediaActiveType && media.type === mediaActiveType.dataLabel})}>
                <div className={styles.mediaRowWrapper}>
                    <div className={styles.title}>
                        <img className={styles.imageContainer} src={media.logoMin} alt={media.name}/>
                        {media.name}
                    </div>
                    <Carousel medias={medias}
                              onClickItem={(episode) => {
                                  this._handleClickMedia(episode, media.ref)
                              }}
                              activeItem={activeItem}
                              smallerCards={media.type === "video"}/>
                    <div className={styles.activeMediaContainer}>
                        {mediaActive && mediaActive.media && media[rowAttribute] === mediaActive.media[rowAttribute] && this.renderActiveMedia(mediaActive, media.ref)}
                    </div>
                </div>
            </div>
        }
        return null;
    }

    render() {
        return <div className={styles.gameContentWrapper}>
            <div className={styles.mediaRowContainer}>
                {this.props.medias ? this.props.medias.map((media) => {
                    return this.renderMediaRow(media);
                }) : <LoadingSpinner/>}
            </div>
        </div>
    }

}

const mapStateToProps = state => {
    return {
        medias: state.mediaReducer.medias,
        mediaActive: state.mediaReducer.mediaActive,
        currentGame: state.gamesReducer.currentGame
    }
};

export default withRouter(connect(mapStateToProps)(MediaSection));
