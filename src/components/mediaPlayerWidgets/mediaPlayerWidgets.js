import React from 'react';
import ReactJkMusicPlayer from "react-jinke-music-player";
import 'react-jinke-music-player/assets/index.css'
import {connect} from "react-redux";
import {ACTIONS_MEDIAS} from "../../actions/mediaActions";


class MediaPlayer extends React.Component {

    constructor(props) {
        super(props);

        this.audioInstance = null;

        this.state = {loading: false};
    }

    componentDidUpdate(prevProps) {
        if (this.props.mediaPlayed) {
            if (this.hasMediaPlayedChanged(prevProps.mediaPlayed, this.props.mediaPlayed)) {
                this.audioInstance.playNext();
            } else {
                if (this.isAudioContextDifferentFromState(this.props.playState)) {
                    if (this.props.playState.isPaused) {
                        this.audioInstance.pause();
                    } else {
                        this.audioInstance.play()
                    }
                }
            }
        }
    }

    isAudioContextDifferentFromState(playState) {
        return playState.isPaused !== playState.audioContextPaused;
    }

    hasMediaPlayedChanged(prevMedia, media) {
        return !prevMedia || prevMedia._id !== media._id
    };

    _handlePlay() {
        this.props.dispatch({
            type: ACTIONS_MEDIAS.SET_PLAY_STATE,
            payload: {
                isPaused: false,
                audioContextPaused: false
            }
        });
    }

    _handlePause() {
        this.props.dispatch({
            type: ACTIONS_MEDIAS.SET_PLAY_STATE,
            payload: {
                isPaused: true,
                audioContextPaused: true
            }
        });
    }

    _handleDownload() {
        const link = document.createElement("a");
        link.download = this.props.mediaPlayed.musicSrc;
        link.href = this.props.mediaPlayed.musicSrc;
        link.click();
        link.remove();
    }


    render() {
        if (!this.props.mediaPlayed) {
            return null
        }
        return (
            <>
                <ReactJkMusicPlayer
                    audioLists={[this.props.mediaPlayed]}
                    autoPlay={true}
                    glassBg={true}
                    mode="full"
                    autoPlayInitLoadPlayList={true}
                    getAudioInstance={(instance) => (this.audioInstance = instance)}
                    showReload={false}
                    showThemeSwitch={false}
                    showPlayMode={false}
                    onAudioPlay={this._handlePlay.bind(this)}
                    onAudioPause={this._handlePause.bind(this)}
                    onAudioDownload={this._handleDownload.bind(this)}
                    showProgressLoadBar={false}
                    responsive={true}
                />
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        mediaPlayed: state.mediaReducer.mediaPlayed,
        playState: state.mediaReducer.playState
    }
};

export default connect(mapStateToProps)(MediaPlayer);