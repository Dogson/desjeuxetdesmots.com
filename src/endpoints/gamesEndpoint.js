import moment from "moment";
import firebase from "../config/firebase";
import {API_CONFIG, IGDB_API} from "../config/apiConfig";
import * as axios from "axios";
import {get} from "../utils";

const db = firebase.firestore();

if (window.location.hostname === "localhost") {
    db.settings({
        host: "localhost:8080",
        ssl: false
    });
}

export async function getGameById(gameId) {
    return await get(`${API_CONFIG.endpoints.GAME}/${gameId}`);
}

async function getAllGames(params) {
    const games = await get(API_CONFIG.endpoints.GAME, params);
    return games.map(_mapResultToGame);
}

export async function getGamesBySearch({search, page, limit}) {
    if (!search || search.length <= 0) {
        return getAllGames({page, limit});
    }
    let ref = db.collection('games')
        .orderBy("searchableName")
        .startAt(search.toUpperCase()).endAt(search.toUpperCase() + "\uf8ff");
    return ref.get()
        .then((snap) => {
            return {
                games: snap.docs.map((doc) => {
                    return doc.data();
                }).map((game) => {
                    return {...game, releaseDate: game.releaseDate ? moment.unix(game.releaseDate) : "A venir"}
                }).sort((gameX, gameY) => {
                    return gameX.releaseDate === "A venir" ? -1 : gameY.releaseDate === "A venir" ? 2 : gameY.releaseDate - gameX.releaseDate
                }),
                page: snap.docs && snap.docs[snap.docs.length - 1]
            }
        })

        .catch((error) => {
            console.error(error);
        })
}

function _mapResultToGame(result) {
    return {
        ...result,
        releaseDate: moment(result.releaseDate)
    }
}

export const getGamesFromIGDB = ({search, limit}) => {
    const proxyUrl = "https://mighty-shelf-65365.herokuapp.com/";
    let key = IGDB_API.key;
    let endpointName = "games";
    let url = `${proxyUrl}${IGDB_API.url}${endpointName}`;
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
                return {
                    ...game,
                    cover: game.cover.url.replace('/t_thumb/', '/t_cover_big/').replace('//', 'https://'),
                    screenshot: game.screenshots && game.screenshots.length && game.screenshots[game.screenshots.length - 1].url.replace('/t_thumb/', '/t_screenshot_big/').replace('//', 'https://'),
                    releaseDate: game.release_dates && Math.min(...game.release_dates && game.release_dates.map((release_date) => {
                            return release_date.date;
                        })
                            .filter((date) => {
                                return date != null;
                            })
                    )
                }
            });
        })
        .catch(err => {
            console.error(err);
        });
};