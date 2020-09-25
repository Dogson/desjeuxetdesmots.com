import moment from "moment";
import {API_CONFIG} from "../config/apiConfig";
import {asyncForEach, get} from "../utils";
import {MEDIA_LOGOS} from "../config/const";

export async function getGamesById(gamesId) {
    const games = [];
    await asyncForEach(gamesId, async (gameId) => {
        games.push(await getGameById(gameId));
    });

    return games;
}

export async function getGameById(gameId) {
    const game = await get(`${API_CONFIG.endpoints.GAME}/${gameId}`);
    return _mapResultToGame(game);
}

export async function getGamesBySearch(params) {
    params.limit = params.limit || 28;
    const games = await get(API_CONFIG.endpoints.GAME, params);
    return games.map(_mapResultToGame);
}

function _mapResultToGame(result) {
    let medias = result.episodes.map(episode => episode.media);
    medias = medias.filter((media, index) => {
        return medias.map(med => med.name).indexOf(media.name) === index;
    })
        .map((media) => {
            let mediaLogo = MEDIA_LOGOS.find((medLogo) => medLogo.name === media.name);
            mediaLogo = mediaLogo && mediaLogo.logoMin;
            return {
                ...media,
                logoMin: mediaLogo
            }
        });
    result.episodes = result.episodes.map((episode) => {
        return {
            ...episode,
        }
    });
    return {
        ...result,
        medias,
        releaseDate: moment(result.releaseDate)
    }
}

export async function getGamesFromIGDB({search, limit}) {
        const params = {
            search,
            limit
        };
        return await get(API_CONFIG.endpoints.IGDB, params);
}