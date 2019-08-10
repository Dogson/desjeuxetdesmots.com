import moment from "moment";
import firebase from "../config/firebase";

const db = firebase.firestore();

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
    let ref = db.collection(mediaDataLabel).orderBy("releaseDate", "desc");
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
                    console.log(media.releaseDate);
                    return {...media, releaseDate: media.releaseDate ? moment(media.releaseDate, 'YYYY-MM-DD') : "A venir"}
                }).sort((mediaX, mediaY) => {
                    return mediaX.isVerfied ? 1 : -1;
                }),
            }
        })
        .then((result) => {
            return Promise.all(result.medias.map((media) => {
                return getMediaGames({media});
            }))
        })
        .then((result) => {
            return {lastDoc: lastDocument, medias: result}
        })

        .catch((error) => {
            console.log(error);
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
            console.log(error);
        })
};