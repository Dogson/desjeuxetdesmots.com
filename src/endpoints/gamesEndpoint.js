import moment from "moment";
import firebase from "../config/firebase";
import {IGDB_API} from "../config/apiConfig";
import * as axios from "axios";

const db = firebase.firestore();

const offset = 28;

const getAllGames = ({lastDoc}) => {
    let ref = db.collection('games').orderBy("releaseDate", "desc");
    if (lastDoc) {
        ref = ref.startAfter(lastDoc);
    }
    ref = ref.limit(offset);
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
                lastDoc: snap.docs && snap.docs[snap.docs.length - 1]
            }
        })

        .catch((error) => {
            console.log(error);
        })
};

export const getGamesBySearch = ({search, lastDoc, limit}) => {
    if (!search || search.length <= 0) {
        return getAllGames({lastDoc});
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
                lastDoc: snap.docs && snap.docs[snap.docs.length - 1]
            }
        })

        .catch((error) => {
            console.log(error);
        })
};

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
        data: `fields id, name, cover.url, release_dates.date; sort popularity desc; where themes!= (42) & name~*"${search}"* & popularity > 1; limit: ${limit};`
    })
        .then(response => {
            return response.data.filter((game) => {
                return game.cover;
            }).map((game) => {
                return {
                    ...game,
                    cover: game.cover.url.replace('/t_thumb/', '/t_cover_big/').replace('//', 'https://'),
                    releaseDate: game.release_dates && moment.unix(Math.min(...game.release_dates && game.release_dates.map((release_date) => {
                        return release_date.date;
                    })))
                }
            });
        })
        .catch(err => {
            console.error(err);
        });
};