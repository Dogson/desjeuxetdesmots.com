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
    }

    _handleClickMedia(episode, ref) {
        this.props.dispatch({
            type: ACTIONS_MEDIAS.SET_ACTIVE_EPISODE,
            payload: {...episode}
        });
        setTimeout(() => {
            window.scrollTo({top: findPos(ref.current).top - 10, behavior: 'smooth'})
        }, 0);
    }

    _handleSaveGames(games) {
        return setGamesForMedia({
            games,
            episodeId: this.props.episodeActive._id
        })
            .then((result) => {
                this.saveMedia(result);
            })
    }

    _handleVerifyMedia() {
        return toggleVerifyMedia({
            verified: true,
            episodeId: this.props.episodeActive._id
        })
            .then((newMedia) => {
                this.saveMedia(newMedia);
            });
    }

    goToNextMedia() {
        let episodes = [];
        this.props.medias.forEach((media) => {
            if (media.name === this.props.episodeActive.media.name) {
               episodes = media.episodes;
            }
        })
        const mappedMedia = episodes.map(media => media.name);
        const currentMediaIndex = mappedMedia.findIndex((media) => {
            return media === this.props.episodeActive.name
        });
        const nextMedia = episodes[currentMediaIndex + 1];
        this.props.dispatch({
            type: ACTIONS_MEDIAS.SET_ACTIVE_EPISODE,
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

    renderActiveMedia(episodeActive, ref) {
        return <div ref={ref}><ActiveMediaBox media={episodeActive} onSaveGames={this._handleSaveGames}
                                              onVerifyMedia={this._handleVerifyMedia}
        /></div>
    }

    renderMediaRow(media) {
        const {episodeActive, rowAttribute} = this.props;
        let episodeActiveType;
        if (episodeActive && episodeActive.media) {
            episodeActiveType = MEDIA_TYPES.find(medType => medType.dataLabel === episodeActive.media.type);
        }
        const medias = media.episodes;
        const activeItem = this.props.episodeActive;
        if (medias && medias.length > 0) {
            return <div key={media.name}
                        className={cx(styles.mediaRowContainer, {[styles.mediaRowContainerActive]: episodeActive && episodeActive.media && episodeActiveType && media.type === episodeActiveType.dataLabel})}>
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
                        {episodeActive && episodeActive.media && media[rowAttribute] === episodeActive.media[rowAttribute] && this.renderActiveMedia(episodeActive, media.ref)}
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
        episodeActive: state.mediaReducer.episodeActive,
        currentGame: state.gamesReducer.currentGame
    }
};

export default withRouter(connect(mapStateToProps)(MediaSection));
