import React from 'react';
import styles from "./mediaPlayerWidgets.module.scss"

export const MediaPlayer = ({url, type}) => {
    let embedUrl;
    switch (type) {
        case 'spotify' :
            embedUrl = url.replace('/episode/', '/embed-podcast/episode/');
            return <iframe src={embedUrl} width="600" height="250" frameBorder="0" allowtransparency="true"
                           allow="encrypted-media"/>;
        default:
            return null;
    }


};
