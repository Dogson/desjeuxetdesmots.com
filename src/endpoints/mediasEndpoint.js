import {get, put} from "../utils";
import {API_CONFIG} from "../config/apiConfig";
import React from "react";
import {MEDIA_LOGOS} from "../config/const";

export async function getAllMedia(mediaDataLabel) {
    const medias = await get(API_CONFIG.endpoints.MEDIA, {"media.type": mediaDataLabel});
    return _sortEpisodesByMedia(medias);
}

export async function setGamesForMedia({episodeId, games}) {
    const response = await put(`${API_CONFIG.endpoints.MEDIA}/${episodeId}`, {
        games: games,
        verified: true
    });
    return response.data;
}

export async function toggleVerifyMedia({episodeId, verified}) {
    const response = await put(`${API_CONFIG.endpoints.MEDIA}/${episodeId}`, {
        verified: verified
    });
    return response.data;
}

const _sortEpisodesByMedia = (episodes) => {
    const medias = [];
    episodes.sort((ep) => {
        return ep.visible ? 1 : -1;
    })
        .forEach((episode) => {
        const index = medias.findIndex((med) => med.name === episode.media.name);
        if (index > -1) {
            medias[index].episodes.push(episode);
        } else {
            let mediaLogo = MEDIA_LOGOS.find((media) => media.name === episode.media.name);
            mediaLogo = mediaLogo && mediaLogo.logoMin;
            medias.push({
                ...episode.media,
                ref: React.createRef(),
                episodes: [episode],
                logoMin: mediaLogo
            })
        }
    });
    return medias;
};