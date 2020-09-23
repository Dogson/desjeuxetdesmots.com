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
            if (!prevProps.mediaPlayed || this.props.mediaPlayed._id !== prevProps.mediaPlayed._id) {
                this.audioInstance.playNext();
            }
            if (prevProps.mediaPlayed && this.props.mediaPlayed._id === prevProps.mediaPlayed._id) {
                if (this.props.mediaPlayed.isPaused !== prevProps.mediaPlayed.isPaused) {
                    if (this.props.mediaPlayed.isPaused) {
                        this.audioInstance.pause();
                    } else {
                        this.audioInstance.play()
                    }
                }
            }
        }
    }

    _handlePlay() {
        this.props.dispatch({
            type: ACTIONS_MEDIAS.SET_PLAYED_MEDIA,
            payload: {
               ...this.props.mediaPlayed,
                isPaused: false
            }
        });
    }

    _handlePause() {
        this.props.dispatch({
            type: ACTIONS_MEDIAS.SET_PLAYED_MEDIA,
            payload: {
                ...this.props.mediaPlayed,
                isPaused: true
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
                    preLoad={false}
                    onAudioPlay={this._handlePlay.bind(this)}
                    onAudioPause={this._handlePause.bind(this)}
                    onAudioDownload={this._handleDownload.bind(this)}
                    toggleMode={false}
                    showProgressLoadBar={false}

                />
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        mediaPlayed: state.mediaReducer.mediaPlayed
    }
};

export default connect(mapStateToProps)(MediaPlayer);