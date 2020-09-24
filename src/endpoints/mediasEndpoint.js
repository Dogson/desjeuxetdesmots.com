import firebase from "../config/firebase";
import {get} from "../utils";
import {API_CONFIG} from "../config/apiConfig";
import React from "react";

const db = firebase.firestore();
if (window.location.hostname === "localhost") {
    db.settings({
        host: "localhost:8080",
        ssl: false
    });
}
const functions = firebase.functions();


export async function getAllMedia(mediaDataLabel) {
    const medias = await get(API_CONFIG.endpoints.MEDIA, {"media.type": mediaDataLabel});
    return _sortEpisodesByMedia(medias);
}

export const setGamesForMedia = ({mediaId, mediaType, games}) => {
        const data = {mediaId: mediaId, mediaType: mediaType, games: games};
        return functions.httpsCallable('setGamesForMedia')(data)
            .catch((error) => {
                console.error(error);
            })
    }
;

export const toggleVerifyMedia = ({mediaType, mediaId, verified}) => {
    const data = {mediaId: mediaId, mediaType: mediaType, verified: verified};
    return functions.httpsCallable('toggleVerifyMedia')(data)
        .catch((error) => {
            console.error(error);
        })
};

const _sortEpisodesByMedia = (episodes) => {
    const medias = [];
    episodes.forEach((episode) => {
        const index = medias.findIndex((med) => med.name === episode.media.name);
        if (index > -1) {
            medias[index].episodes.push(episode);
        } else {
            medias.push({
                ...episode.media,
                ref: React.createRef(),
                episodes: [episode]
            })
        }
    });
    return medias;
};