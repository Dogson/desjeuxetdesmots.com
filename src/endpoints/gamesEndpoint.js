import moment from "moment";
import {API_CONFIG} from "../config/apiConfig";
import * as axios from "axios";
import {asyncForEach, get} from "../utils";

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

export const getGamesFromIGDB = ({search, limit}) => {
    const proxyUrl = process.env.REACT_APP_PROXY_URL;
    let key = process.env.REACT_APP_IGDB_API_KEY;
    const apiUrl = process.env.REACT_APP_IGDB_API_URL;
    let endpointName = "games";
    let url = `${proxyUrl}${apiUrl}${endpointName}`;
    limit = limit || 10;
    return axios({
        url: url,
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'user-key': key,
            "X-Requested-With": "XMLHttpRequest"
        },
        data: `fields id, name, cover.url, screenshots.url, release_dates.date; sort popularity desc; where themes!= (42) & name~*"${search}"*; limit: ${limit};`
    })
        .then(response => {
            return response.data.filter((game) => {
                return game.cover;
            }).map((game) => {
                const result =  {
                    ...game,
                    igdbId: game.id.toString(),
                    cover: game.cover && game.cover.url.replace('/t_thumb/', '/t_cover_big/').replace('//', 'https://'),
                    screenshot: game.screenshots && game.screenshots.length && game.screenshots[game.screenshots.length - 1].url.replace('/t_thumb/', '/t_screenshot_big/').replace('//', 'https://'),
                    releaseDate: game.release_dates && new Date(Math.min(...game.release_dates && game.release_dates.map((release_date) => {
                            return release_date.date;
                        })
                            .filter((date) => {
                                return date != null;
                            })
                    ) * 1000)
                };
                delete result.id;
                return result;
            });
        })
};