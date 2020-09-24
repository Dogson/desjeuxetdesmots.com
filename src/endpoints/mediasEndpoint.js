import {get, put} from "../utils";
import {API_CONFIG} from "../config/apiConfig";
import React from "react";

export async function getAllMedia(mediaDataLabel) {
    const medias = await get(API_CONFIG.endpoints.MEDIA, {"media.type": mediaDataLabel});
    return _sortEpisodesByMedia(medias);
}

export async function setGamesForMedia({episodeId, games}) {
    const response = await put(`${API_CONFIG.endpoints.MEDIA}/${episodeId}`, {
        games: games
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