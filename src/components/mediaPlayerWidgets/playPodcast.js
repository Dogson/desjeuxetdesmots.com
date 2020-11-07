import React from 'react';
import {connect} from "react-redux";
import styles from "./playPodcast.module.scss"
import {FaPlay, FaPause} from "react-icons/fa";
import {ACTIONS_MEDIAS} from "../../actions/mediaActions";
import {MEDIA_LOGOS} from "../../config/const";

const PlayPodcast = (props) => {
    const {episodeActive, mediaPlayed, playState} = props;
    const mediaLogo = MEDIA_LOGOS.find(med => episodeActive.media.name === med.name)
    const thumbnail = episodeActive && ((mediaLogo && mediaLogo.overrideThumbnail) || episodeActive.image);

    return episodeActive ?
        <div className={styles.playPodcastContainer} onClick={() => {
            props.dispatch({
                type: ACTIONS_MEDIAS.SET_PLAYED_MEDIA,
                payload: {
                    _id: episodeActive._id,
                    name: episodeActive.name,
                    singer: episodeActive.media.name,
                    cover: thumbnail,
                    musicSrc: episodeActive.fileUrl,
                }
            });
            props.dispatch({
                type: ACTIONS_MEDIAS.SET_PLAY_STATE,
                payload: {
                    isPaused: mediaPlayed && mediaPlayed._id === episodeActive._id && !playState.isPaused
                }
            });
        }}>
            <img src={thumbnail} alt={episodeActive.name}/>
            {mediaPlayed && mediaPlayed._id === episodeActive._id && !playState.isPaused ?
                <FaPause className={styles.playIcon}/> :
                <FaPlay className={styles.playIcon}/>
            }
        </div> :
        null
};

const mapStateToProps = state => {
    return {
        episodeActive: state.mediaReducer.episodeActive,
        mediaPlayed: state.mediaReducer.mediaPlayed,
        playState: state.mediaReducer.playState
    }
};

export default connect(mapStateToProps)(PlayPodcast);