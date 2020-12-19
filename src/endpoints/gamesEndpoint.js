import moment from "moment";
import {API_CONFIG} from "../config/apiConfig";
import {asyncForEach, get} from "../utils";
import store from "../store";

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

export async function getGamesAndMediasBySearch(params) {
    const filters = store.getState().settingsReducer.settings.filters;
    params.limit = params.limit || 28;
    params.filters = filters && filters.medias && JSON.stringify({
        "media.name": params["media.name"] || _mapFilter(filters.medias),
    });
    delete params["media.name"];
    const result = await get(API_CONFIG.endpoints.GAME, params);
    return {
        games: result.games.map(_mapResultToGame),
        medias: result.medias
    };
}

function _mapResultToGame(result) {
    const filters = store.getState().settingsReducer.settings.filters;
    result.episodes = result.episodes
        .filter((episode) => {
            return (!filters.medias || filters.medias[episode.media.name]) && episode.verified;
        })
        .sort((epX, epY) => {
            return epX.releaseDate > epY.releaseDate ? -1 : 1;
        })
        .reduce((tot, ep) => {
            const epIndex = tot.findIndex((med => med.name === ep.media.name));
            if (epIndex > -1) {
                tot[epIndex].episodes.push(ep);
            } else {
                tot.push({
                    episodes: [ep],
                    name: ep.media.name,
                    logoMin: ep.media.logo
                });
            }
            return tot;
        }, [])
        .reduce((tot, med) => {
            med.episodes.forEach((ep) => {
                tot.push(ep);
            })
            return tot;
        }, [])

    let medias = result.episodes.map(episode => episode.media);
    medias = medias.filter((media, index) => {
        return medias.map(med => med.name).indexOf(media.name) === index;
    })


    return {
        ...result,
        medias,
        formattedDate: moment(result.releaseDate).format("YYYY") !== "2077" ? moment(result.releaseDate).format("YYYY") : "À venir"
    }
}

export async function getGamesFromIGDB({search, limit = 100, alternativeSearch}) {
    const params = {
        search,
        limit,
        noFilter: alternativeSearch
    };
    const result = await get(API_CONFIG.endpoints.IGDB, params)
    return result.map((game) => {
        return {
            ...game,
            formattedDate: moment(game.releaseDate).format("YYYY") !== "2077" ? moment(game.releaseDate).format("YYYY") : "À venir",
        };
    })
}

function _mapFilter(filter) {
    const res = [];
    Object.keys(filter).forEach((key) => {
        if (filter[key]) {
            res.push(key)
        }
    });
    return {$in: res};
}