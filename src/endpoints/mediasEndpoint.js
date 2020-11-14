import {get, put} from "../utils";
import {API_CONFIG} from "../config/apiConfig";
import React from "react";
import {MEDIA_LOGOS} from "../config/const";

export async function getAllMedia() {
    const medias = await get(API_CONFIG.endpoints.EPISODES, {"verified": false});
    return _sortEpisodesByMedia(medias);
}

export async function getMedia(name) {
    const medias = await get(API_CONFIG.endpoints.MEDIAS, {"name": name});
    const media = medias && medias.length > 0 && medias[0];
    const mediaConf = MEDIA_LOGOS.find(med => med.name === media.name);
    return {
        ...media,
        logo: mediaConf && mediaConf.logoMin
    };
}

export async function getEpisodesForMedia(name) {
    const medias = await get(API_CONFIG.endpoints.EPISODES, {"verified": true, "media.name": name});
    return _sortEpisodesByMedia(medias);
}


export async function setGamesForEpisode({episodeId, games}) {
    const response = await put(`${API_CONFIG.endpoints.EPISODES}/${episodeId}`, {
        games: games,
        verified: true
    });
    return response.data;
}

export async function toggleVerifyEpisode({episodeId, verified}) {
    const response = await put(`${API_CONFIG.endpoints.EPISODES}/${episodeId}`, {
        verified: verified
    });
    return response.data;
}

const _sortEpisodesByMedia = (episodes) => {
    const medias = [];
    episodes.sort((ep) => {
        return ep.verified ? 1 : -1;
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