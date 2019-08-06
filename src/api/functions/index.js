// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
const admin = require('firebase-admin');

// The Firebase Admin SDK to access the Firebase Realtime Database.
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

const spotify = require('./spotify');
const parseHelper = require('./parseHelper');

const cosyCornerConfig = {
    excludeStrings: ['Zone de Confort', '[HS]'],
    endOfParseStrings: ['Remerciements', 'Playlist']
};

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
                    games: games.map((game) => db.doc('games/' + game.id))
                })
            })
            .catch((error) => {
                console.log(error);
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
                console.log(error);
            });
    });
