import moment from "moment";
import firebase from "../config/firebase";

const db = firebase.firestore();
const functions = firebase.functions();

const offset = 6;
const offsetInit = offset * 2;

export const getNumberOfMedia = ({mediaDataLabel}) => {
    return db.collection("itemsNumber").doc(mediaDataLabel).get()
        .then((doc) => {
            return doc.exists ? doc.data() : 0;
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });
};

export const getAllMedia = ({mediaDataLabel, lastDoc}) => {
    let ref = db.collection(mediaDataLabel).orderBy("isVerified", "asc");
    if (lastDoc) {
        ref = ref.startAfter(lastDoc);
    }
    ref = ref.limit(lastDoc ? offset : offsetInit);
    let lastDocument;
    return ref.get()
        .then((snap) => {
            lastDocument = snap.docs && snap.docs[snap.docs.length - 1];
            return {
                medias: snap.docs.map((doc) => {
                    return {...doc.data(), id: doc.id};
                }).map((media) => {
                    return {
                        ...media,
                        releaseDate: media.releaseDate ? moment(media.releaseDate, 'YYYY-MM-DD') : "A venir"
                    }
                }),
            }
        })
        .then((result) => {
            return Promise.all(result.medias.map((media) => {
                return getMediaGames({media});
            }))
        })
        .then((result) => {
            return {
                lastDoc: lastDocument, medias: result.sort((mediaX, mediaY) => {
                    return mediaX.isVerified ? 1 : -1;
                })
            }
        })

        .catch((error) => {
            console.error(error);
        })
};

export const getMediaGames = ({media}) => {
    let gamesResult = [];
    return Promise.all(media.games.map((gameRef) => {
        {
            return gameRef.get()
                .then((doc) => {
                    gamesResult.push(doc.data());
                }).catch(function (error) {
                    console.log("Error getting document:", error);
                });
        }
    }))
        .then(() => {
            return {...media, games: gamesResult}
        })
        .catch((error) => {
            console.error(error);
        })
};

export const setGamesForMedia = ({mediaId, mediaType, games}) => {
    const data = {mediaId: mediaId, mediaType: mediaType, games: games};
        return functions.httpsCallable('setGamesForMedia')(data)
            .catch((error) => {
                console.error(error);
            })
    }
;

export const toggleVerifyMedia = ({mediaType, mediaId, verified}) => {
    return db.collection(mediaType).doc(`${mediaId}`).update({
        isVerified: verified
    })
}