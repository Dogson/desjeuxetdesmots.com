const functions = require('firebase-functions');
const admin = require('firebase-admin');
// const firebase = require('firebase');
const axios = require('axios');
const IGDB_API = {
    url: "https://api-v3.igdb.com/",
    key: "e96d3dcb3da70046dfcfd9204e27ac26"
};

// The Firebase Admin SDK to access the Firebase Realtime Database.
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

const moment = require('moment');
const spotify = require('./spotify');
const parseHelper = require('./parseHelper');
const rss = require('./rss');

const cosyCornerConfig = {
    excludeStrings: ['Zone de Confort', '[HS]'],
    endOfParseStrings: ['Remerciements', 'Playlist']
};

const silenceOnJoueConfig = {
    excludeStrings: [],
    endOfParseStrings: []
};

const increment = admin.firestore.FieldValue.increment(1);

exports.changeMomentDateToUnix = functions.https.onRequest((req, res) => {
    const batch = db.batch();
    return db.collection("silenceOnJoue").get()
        .then((snap) => {
            let result = [];
            snap.docs.forEach((doc) => {
                const data = doc.data();
                if (!data.isVerified) {
                    batch.update(doc.ref, {games: []});
                }
            });

            return batch.commit()
                .then(() => {
                    res.json({res: result, count: result.length});
                })
        })
});

exports.getZQSD = rss.getZQSD;

exports.getGamekult = rss.getGamekult;

exports.getCosyCorner = spotify.copyCosyCornerFromSpotify;

exports.getSilenceOnJoue = spotify.copySilenceOnJoueFromSpotify;

exports.generateCosyCornerGames = functions.firestore
    .document('cosyCorner/{id}').onCreate((snap, context) => {
        const episode = snap.data();
        let games;
        return parseHelper.getVideoGamesFromString(episode.description, cosyCornerConfig)
            .then((result) => {
                games = result;
                return setGamesFromMedia(context.params.id, games, 'cosyCorner');
            })
            .then(() => {
                return db.collection('cosyCorner').doc(context.params.id).update({
                    games: games.map((game) => db.doc('games/' + game.id)),
                    isVerified: false
                })
            })
            .then(() => {
                return db.collection('itemsNumber').doc('cosyCorner').update({
                    count: increment
                })
            })
            .catch((error) => {
                console.error(error);
            });
    });

exports.generateSilenceOnJoueGames = functions.firestore
    .document('silenceOnJoue/{id}').onCreate((snap, context) => {
        const episode = snap.data();
        let games;
        return parseHelper.getVideoGamesFromString(episode.name, silenceOnJoueConfig)
            .then((result) => {
                games = result;
                return setGamesFromMedia(context.params.id, games, 'silenceOnJoue');
            })
            .then(() => {
                return db.collection('silenceOnJoue').doc(context.params.id).update({
                    games: games.map((game) => db.doc('games/' + game.id)),
                    isVerified: false
                })
            })
            .then(() => {
                return db.collection('itemsNumber').doc('silenceOnJoue').update({
                    count: increment
                })
            })
            .catch((error) => {
                console.error(error);
            });
    });

function setGamesFromMedia(episodeId, games, media) {
    return Promise.all(games.map((game) => {
        return db.collection('games').doc(`${game.id}`).set(
            {...game, lastUpdated: Math.floor(Date.now() / 1000)}, {merge: true}
        )
            .then(() => {
                const update = {};
                update[media] = admin.firestore.FieldValue.arrayUnion(db.doc(`${media}/` + episodeId));
                return db.collection('games').doc(`${game.id}`).update(update)
            })
    }));
}

exports.addGameSearchableIndex = functions.firestore
    .document('games/{id}').onCreate((snap, context) => {
        const game = snap.data();

        return db.collection('games').doc(context.params.id).update({
            searchableName: game.name.toUpperCase()
        })
            .catch((error) => {
                console.error(error);
            });
    });

exports.setGamesForMedia = functions.https.onCall((data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
            'while authenticated.');
    }
    const {mediaId, mediaType, games} = data;
    return db.collection(mediaType).doc(`${mediaId}`).get()
        .then((doc) => {
            const result = doc.data();
            const oldGames = result.games.map((game) => {
                return game.id
            });
            const currentGames = games.map((game) => {
                return String(game.id)
            });
            const deletedGames = oldGames.filter((game) => {
                return currentGames.indexOf(game) === -1;
            });
            return Promise.all(deletedGames.map((gameId) => {
                let mediaFields = {};
                mediaFields[`${mediaType}`] = admin.firestore.FieldValue.arrayRemove(db.doc(`${mediaType}/${mediaId}`));
                return db.collection("games").doc(gameId).update(mediaFields);
            }))
        })
        .then(() => {
            return Promise.all(games.map((game) => {
                return db.collection('games').doc(`${game.id}`).get()
                    .then((doc) => {
                        if (doc.exists) {
                            return doc.data();
                        } else {
                            let gameMapped = {
                                cover: game.cover,
                                id: game.id,
                                name: game.name,
                                releaseDate: game.releaseDate && game.releaseDate.unix ? game.releaseDate.unix() : game.releaseDate,
                                searchableName: game.name.toUpperCase()
                            };
                            gameMapped[`${mediaType}`] = [];
                            return db.collection('games').doc(`${game.id}`).set(gameMapped)
                        }
                    })
                    .then(() => {
                        let gameUpdates = {
                            lastUpdated: Math.floor(Date.now() / 1000)
                        };
                        gameUpdates[`${mediaType}`] = admin.firestore.FieldValue.arrayUnion(db.doc(`${mediaType}/` + mediaId));
                        return db.collection('games').doc(`${game.id}`).update(gameUpdates)

                    })
            }))
                .then(() => {
                    return db.collection(`${mediaType}`).doc(`${mediaId}`).update({
                        games: games.map((game) => {
                            return db.doc('games/' + game.id)
                        }),
                        isVerified: true
                    })
                })
        })
        .then(() => {
            return Promise.resolve({'status': 'success'});
        })
        .catch((error) => {
            return Promise.reject({status: 'error', error: error});
        })
});

exports.toggleVerifyMedia = functions.https.onCall((data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
            'while authenticated.');
    }
    const {mediaType, mediaId, verified} = data;
    return db.collection(mediaType).doc(`${mediaId}`).update({
        isVerified: verified
    })
        .then(() => {
            return Promise.resolve({status: 'success'});
        })
        .catch((error) => {
            return Promise.reject({status: 'error', error: error});
        })
});

exports.scheduledFunction = functions.pubsub
    .schedule('every wednesday 12:00')
    .onRun(() => {
        console.log("fetching cosy corners");
        return spotify.getSpotifyAccessToken()
            .then((token) => {
                return spotify.copyAndWriteMediaWithOffset(token, 0, spotify.cosyCorner.id);
            })
            .then(() => {
                console.log("success");
            })
            .catch(() => {
                console.log("error");
            })
    });


// exports.addScreenshotToExistingGames = functions.https.onRequest((req, res) => {
//     const proxyUrl = "https://mighty-shelf-65365.herokuapp.com/";
//     let key = IGDB_API.key;
//     let endpointName = "games";
//     let url = `${proxyUrl}${IGDB_API.url}${endpointName}`;
//     let count = {screenshotOK: 0, gameNotExist: 0, screenshotNotExist: 0, errorUpdate: 0};
//     return db.collection("games").get()
//         .then((snap) => {
//             const docs = snap.docs;
//            return Promise.all(docs.map((doc) => {
//                 const docRef = doc.ref;
//                 const game = doc.data();
//                 return axios({
//                     url: url,
//                     method: 'POST',
//                     headers: {
//                         'Accept': 'application/json',
//                         'user-key': key,
//                         "X-Requested-With": "XMLHttpRequest"
//                     },
//                     data: `fields name, screenshots.url; where id = ${game.id};`
//                 })
//                     .then((response) => {
//                         const games = response.data;
//                         if (games.length) {
//                             const screenshots = games[0].screenshots;
//                             const screenshot = screenshots && screenshots.length && screenshots[screenshots.length - 1].url.replace('/t_thumb/', '/t_screenshot_big/').replace('//', 'https://');
//                             if (screenshot) {
//                                 return docRef.update({screenshot: screenshot})
//                                     .then(() => {
//                                         count.screenshotOK++;
//                                         return Promise.resolve(true);
//                                     })
//                                     .catch((error) => {
//                                         console.error(error);
//                                         count.errorUpdate++;
//                                         return Promise.resolve(true);
//                                     });
//                             }
//                             else {
//                                 count.screenshotNotExist++;
//                                 return Promise.resolve(true);
//                             }
//
//                         }
//                         else {
//                             count.gameNotExist++;
//                             return Promise.resolve(true);
//                         }
//                     })
//             }))
//                 .then(() => {
//                     res.json({success: true, count: count});
//                 })
//                 .catch((error) => {
//                     res.json(error);
//                 });
//         })
// });