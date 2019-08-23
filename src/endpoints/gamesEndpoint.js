import moment from "moment";
import firebase from "../config/firebase";
import {IGDB_API} from "../config/apiConfig";
import * as axios from "axios";
import {MEDIA_TYPES} from "../config/const";

const db = firebase.firestore();

const offset = 28;

async function getMediasFromRefs(refs, mediaType, mediaApp) {
    return Promise.all(refs.map((ref) => {
        return ref.get()
            .then((doc) => {
                if (doc.exists) {
                    return {...doc.data(), id: doc.id};
                }
            })
    }))
        .then((medias) => {
            return Promise.all(medias.map((media) => {
                let games = [];
                return Promise.all(media.games.map((gameRef) => {
                    return gameRef.get()
                        .then((doc) => {
                            if (doc.exists) {
                                games.push(doc.data());
                            }
                        })
                }))
                    .then(() => {
                        media.games = games;
                        media.releaseDate = moment(media.releaseDate);
                        media.type = mediaType;
                        media.app = mediaApp;
                        return media;
                    })
            }))
        })
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

export async function getGameById(gameId) {
    let game;
    return db.collection('games').doc(gameId).get()
        .then((snap) => {
            game = snap.data();

            return asyncForEach(MEDIA_TYPES, async (mediaType) => {
                game[mediaType.dataLabel] = [];
                return asyncForEach(mediaType.medias, async (media) => {
                    if (game[media.dataLabel]) {
                        const medias = await getMediasFromRefs(game[media.dataLabel], media.dataLabel, media.app);
                        game[mediaType.dataLabel] = game[mediaType.dataLabel].concat(medias);
                    }
                })
            })
        })
        .then(() => {
            return game;
        })
        .catch((error) => {
            console.error(error);
        })
};

const getAllGames = ({lastDoc}) => {
    let ref = db.collection('games').orderBy("lastUpdated", "desc");
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
                    return gameX.lastUpdated ? -1 : gameY.lastUpdated === "A venir" ? 2 : gameY.lastUpdated - gameX.lastUpdated
                }).filter((game) => {
                    let isDisplayed = false;
                    for (let i = 0; i < MEDIA_TYPES.length; i++) {
                        const media = MEDIA_TYPES[i].medias;
                        for (let j = 0; j < media.length; j++) {
                            const dataLabel = media[j].dataLabel;
                            if (game[dataLabel] && game[dataLabel].length > 0) {
                                isDisplayed = true;
                            }
                        }
                    }
                    return isDisplayed;
                }),
                lastDoc: snap.docs && snap.docs[snap.docs.length - 1]
            }
        })

        .catch((error) => {
            console.error(error);
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
            console.error(error);
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