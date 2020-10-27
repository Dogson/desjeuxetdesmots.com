import React from 'react';
import {connect} from "react-redux";
import styles from "./playPodcast.module.scss"
import {FaPlay, FaPause} from "react-icons/fa";
import {ACTIONS_MEDIAS} from "../../actions/mediaActions";
import {MEDIA_LOGOS} from "../../config/const";

const PlayPodcast = (props) => {
    const {mediaActive, mediaPlayed, playState} = props;
    const mediaLogo = MEDIA_LOGOS.find(med => mediaActive.media.name === med.name)
    const thumbnail = mediaActive && ((mediaLogo && mediaLogo.overrideThumbnail) || mediaActive.image);

    return mediaActive ?
        <div className={styles.playPodcastContainer} onClick={() => {
            props.dispatch({
                type: ACTIONS_MEDIAS.SET_PLAYED_MEDIA,
                payload: {
                    _id: mediaActive._id,
                    name: mediaActive.name,
                    singer: mediaActive.media.name,
                    cover: thumbnail,
                    musicSrc: mediaActive.fileUrl,
                }
            });
            props.dispatch({
                type: ACTIONS_MEDIAS.SET_PLAY_STATE,
                payload: {
                    isPaused: mediaPlayed && mediaPlayed._id === mediaActive._id && !playState.isPaused
                }
            });
        }}>
            <img src={thumbnail} alt={mediaActive.name}/>
            {mediaPlayed && mediaPlayed._id === mediaActive._id && !playState.isPaused ?
                <FaPause className={styles.playIcon}/> :
                <FaPlay className={styles.playIcon}/>
            }
        </div> :
        null
};

const mapStateToProps = state => {
    return {
        mediaActive: state.mediaReducer.mediaActive,
        mediaPlayed: state.mediaReducer.mediaPlayed,
        playState: state.mediaReducer.playState
    }
};

export default connect(mapStateToProps)(PlayPodcast);