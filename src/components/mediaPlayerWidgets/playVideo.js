import React from 'react';
import {connect} from "react-redux";
import {ACTIONS_MEDIAS} from "../../actions/mediaActions";
import YouTube from 'react-youtube';
import styles from "./playVideo.module.scss";
import cx from "classnames";

class PlayVideo extends React.Component {
    constructor(props) {
        super(props);

        this._handlePlay = this._handlePlay.bind(this);
    }

    _handlePlay() {
        if (!this.props.playState.isPaused) {
            this.props.dispatch({
                type: ACTIONS_MEDIAS.SET_PLAY_STATE,
                payload: {
                    isPaused: true
                }
            });
        }
    }


    render() {

        const opts = {
            height: '390',
            width: '640',
            playerVars: {},
            allowFullScreen: 1
        };

        const {episodeActive} = this.props;
        const beforeId = 'watch?v=';
        const mediaId = episodeActive.fileUrl.slice(episodeActive.fileUrl.indexOf('watch?v=') + beforeId.length);
        return episodeActive ?
            <div className={cx(styles.videoContainer, {[styles.smallVideo]: this.props.smallVideo})}><YouTube videoId={mediaId} opts={opts} onPlay={this._handlePlay}/></div> :
            null
    }
}

const mapStateToProps = state => {
    return {
        episodeActive: state.mediaReducer.episodeActive,
        episodePlayed: state.mediaReducer.episodePlayed,
        playState: state.mediaReducer.playState
    }
};

export default connect(mapStateToProps)(PlayVideo);