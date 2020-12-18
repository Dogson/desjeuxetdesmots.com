import {get, put} from "../utils";
import {API_CONFIG} from "../config/apiConfig";
import React from "react";

export async function getAllMedias() {
    return await get(API_CONFIG.endpoints.MEDIAS);
}


export async function getMedia(name) {
    const medias = await get(API_CONFIG.endpoints.MEDIAS, {"name": name});
    return medias && medias.length > 0 && medias[0];
}

export async function getAllEpisodes() {
    const medias = await get(API_CONFIG.endpoints.EPISODES, {"verified": false});
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
                medias.push({
                    ...episode.media,
                    ref: React.createRef(),
                    episodes: [episode],
                    logoMin: episode.media.logo
                })
            }
        });
    return medias;
};
