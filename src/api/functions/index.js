const functions = require('firebase-functions');
const admin = require('firebase-admin');
// const firebase = require('firebase');

// The Firebase Admin SDK to access the Firebase Realtime Database.
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

const moment = require('moment');
const spotify = require('./spotify');
const parseHelper = require('./parseHelper');

const cosyCornerConfig = {
    excludeStrings: ['Zone de Confort', '[HS]'],
    endOfParseStrings: ['Remerciements', 'Playlist']
};

const increment = admin.firestore.FieldValue.increment(1);

exports.getCosyCorner = spotify.copyCosyCornerShowsFromSpotify;

exports.generateCosyCornerGames = functions.firestore
    .document('cosyCorner/{id}').onCreate((snap, context) => {
        const episode = snap.data();
        let games;
        return parseHelper.getVideoGamesFromString(episode.description, cosyCornerConfig)
            .then((result) => {
                games = result;
                return setGamesFromCosyCorner(context.params.id, games);
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

function setGamesFromCosyCorner(episodeId, games) {
    return Promise.all(games.map((game) => {
        return db.collection('games').doc(`${game.id}`).set(
            {...game, lastUpdated: Math.floor(Date.now() / 1000)}, {merge: true}
        )
            .then(() => {
                return db.collection('games').doc(`${game.id}`).update(
                    {cosyCorners: admin.firestore.FieldValue.arrayUnion(db.doc('cosyCorner/' + episodeId))})
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
                mediaFields[`${mediaType}s`] = admin.firestore.FieldValue.arrayRemove(db.doc(`${mediaType}/${mediaId}`));
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
                                releaseDate: game.releaseDate.unix ? game.releaseDate.unix() : game.releaseDate,
                                searchableName: game.name.toUpperCase()
                            };
                            gameMapped[`${mediaType}s`] = [];
                            return db.collection('games').doc(`${game.id}`).set(gameMapped)
                        }
                    })
                    .then(() => {
                        let gameUpdates = {
                            lastUpdated: Math.floor(Date.now() / 1000)
                        };
                        gameUpdates[`${mediaType}s`] = admin.firestore.FieldValue.arrayUnion(db.doc(`${mediaType}/` + mediaId));
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