import React from 'react';
import styles from "./mediaPlayerWidgets.module.scss"
import {Helmet} from "react-helmet";
import PageLayout from "../../layouts/PageLayout";
import {LoadingSpinner} from "../loadingSpinner/loadingSpinner";
import Iframe from 'react-iframe'

export class MediaPlayer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {isLoading: true}
    }

    componentDidUpdate(prevProps) {
        if (prevProps.url !== this.props.url) {
            this.setState({isLoading: true})
        }
    }

    render() {
        const {url, type} = this.props;
        let embedUrl;
        switch (type) {
            case "spotify" :
                embedUrl = url.replace('/episode/', '/embed-podcast/episode/');
                return <div style={{position: 'relative'}}>{this.state.isLoading ?
                    <div style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: '560px',
                        height: '250px',
                        backgroundColor: '#2E4052'
                    }}><LoadingSpinner size={40}/></div> : null}
                    <Iframe url={embedUrl} width="560" height="250" frameBorder="0" allowtransparency="true"
                            allow="encrypted-media" onLoad={() => this.setState({isLoading: false})}/>
                </div>;
            case "soundcloud":
                return <div style={{position: 'relative', marginBottom: '10px'}}>{this.state.isLoading ?
                    <div style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: '560px',
                        height: '250px',
                        backgroundColor: '#2E4052'
                    }}><LoadingSpinner size={40}/></div> : null}
                    <Iframe width="560" height="250" scrolling="no" frameBorder="0" allow="autoplay"
                            url={`https://w.soundcloud.com/player/?url=${url}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`}
                            onLoad={() => this.setState({isLoading: false})}/>
                </div>;
            case "youtube":
                embedUrl = url.replace('https://www.youtube.com/watch?v=', '');
                return <div style={{position: 'relative'}}>{this.state.isLoading ?
                    <div style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: '560px',
                        height: '315px',
                        backgroundColor: '#2E4052'
                    }}><LoadingSpinner size={40}/></div> : null}
                    <Iframe width="560" height="315" url={`https://www.youtube.com/embed/${embedUrl}`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            onLoad={() => this.setState({isLoading: false})}/>
                </div>;
            default:
                return null;
        }
    }
}
