import React from "react";
import styles from "./mediaSection.module.scss";
import {MEDIA_TYPES} from "../../config/const";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import cx from "classnames";
import Carousel from "../carousel/carousel";
import {ACTIONS_MEDIAS} from "../../actions/mediaActions";
import {findPos} from "../../utils";
import {setGamesForEpisode, toggleVerifyEpisode} from "../../endpoints/mediasEndpoint";
import {LoadingSpinner} from "../loadingSpinner/loadingSpinner";
import ActiveEpisodeBox from "../activeEpisodeBox/activeEpisodeBox";

class MediaSection extends React.Component {
    constructor(props) {
        super(props);

        this._handleClickEpisode = this._handleClickEpisode.bind(this);
        this._handleSaveGames = this._handleSaveGames.bind(this);
        this._handleVerifyEpisode = this._handleVerifyEpisode.bind(this);
    }

    _handleClickEpisode(episode, ref) {
        this.props.dispatch({
            type: ACTIONS_MEDIAS.SET_ACTIVE_EPISODE,
            payload: {...episode}
        });
        setTimeout(() => {
            window.scrollTo({top: findPos(ref.current).top - 10, behavior: 'smooth'})
        }, 0);
    }

    _handleSaveGames(games) {
        return setGamesForEpisode({
            games,
            episodeId: this.props.episodeActive._id
        })
            .then((result) => {
                this.saveEpisode(result);
            })
    }

    _handleVerifyEpisode() {
        return toggleVerifyEpisode({
            verified: true,
            episodeId: this.props.episodeActive._id
        })
            .then((episode) => {
                this.saveEpisode(episode);
            });
    }

    goToNextEpisode() {
        let episodes = [];
        this.props.medias.forEach((media) => {
            if (media.name === this.props.episodeActive.media.name) {
               episodes = media.episodes;
            }
        })
        const mappedEpisodes = episodes.map(ep => ep.name);
        const currentEpIndex = mappedEpisodes.findIndex((ep) => {
            return ep === this.props.episodeActive.name
        });
        const nextEp = episodes[currentEpIndex + 1];
        this.props.dispatch({
            type: ACTIONS_MEDIAS.SET_ACTIVE_EPISODE,
            payload: nextEp
        });
    }

    saveEpisode(newEpisode) {
        const {medias} = this.props;
        console.log(medias);
        const updatedMedias = medias.map((media) => {
            media.episodes = media.episodes.map((episode) => {
                if (episode._id === newEpisode._id) {
                    return {...newEpisode, verified: true};
                }
                return episode;
            });
            return media;
        });
        console.log(updatedMedias);
        this.props.dispatch({
            type: ACTIONS_MEDIAS.SET_MEDIAS_LIST,
            payload: updatedMedias
        });
        this.goToNextEpisode();
    }

    renderActiveEpisode(episodeActive, ref) {
        return <div ref={ref}><ActiveEpisodeBox episode={episodeActive} onSaveGames={this._handleSaveGames}
                                              onVerifyEpisode={this._handleVerifyEpisode}
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
                                  this._handleClickEpisode(episode, media.ref)
                              }}
                              activeItem={activeItem}
                              smallerCards={media.type === "video"}/>
                    <div className={styles.activeEpisodeContainer}>
                        {episodeActive && episodeActive.media && media[rowAttribute] === episodeActive.media[rowAttribute] && this.renderActiveEpisode(episodeActive, media.ref)}
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
