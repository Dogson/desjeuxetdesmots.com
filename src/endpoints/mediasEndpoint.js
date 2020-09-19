import moment from "moment";
import firebase from "../config/firebase";

const db = firebase.firestore();
if (window.location.hostname === "localhost") {
    db.settings({
        host: "localhost:8080",
        ssl: false
    });
}
const functions = firebase.functions();

const offset = 6;
const offsetInit = offset * 2;

export const getNumberOfMedia = ({mediaDataLabel}) => {
    return db.collection("itemsNumber").doc(mediaDataLabel).get()
        .then((doc) => {
            return doc.exists ? doc.data() : 0;
        }).catch(function (error) {
            console.error("Error getting document:", error);
        });
};

export const getAllMedia = ({mediaDataLabel, page}) => {
    let ref = db.collection(mediaDataLabel).orderBy("isVerified", "asc");
    if (page) {
        ref = ref.startAfter(page);
    }
    ref = ref.limit(page ? offset : offsetInit);
    let pageument;
    return ref.get()
        .then((snap) => {
            pageument = snap.docs && snap.docs[snap.docs.length - 1];
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
                page: pageument, medias: result.sort((mediaX) => {
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
    if (!media.games || !media.games.length) {
        return {...media, games: []}
    }
    return Promise.all(media.games.map((gameRef) => {
        {
            return gameRef.get()
                .then((doc) => {
                    gamesResult.push(doc.data());
                }).catch(function (error) {
                    console.error("Error getting document:", error);
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
    const data = {mediaId: mediaId, mediaType: mediaType, verified: verified};
    return functions.httpsCallable('toggleVerifyMedia')(data)
        .catch((error) => {
            console.error(error);
        })
};

// export async function getZQSD() {
//     const proxyUrl = "https://mighty-shelf-65365.herokuapp.com/";
//     const parser = new Parser();
//     const feed = await parser.parseURL(proxyUrl + 'https://www.youtube.com/feeds/videos.xml?channel_id=UCqJ-Xo29CKyLTjn6z2XwYAw');
//     const entries = feed.items.map(function (entry) {
//         let id = entry.guid && entry.guid.substring(entry.guid.indexOf('tracks/') + 1).replace('racks/', '');
//         // console.log(entry.guid);
//         return {
//             id: id,
//             name: entry.title,
//             // image: entry.itunes.image,
//             // description: entry.itunes.summary,
//             releaseDate: moment(entry.pubDate).format('YYYY-MM-DD'),
//             url: "api.soundcloud.com/tracks/" + id,
//             isVerified: false //TODO REMOVE !!!!!
//         };
//     });
//     // return Promise.all(entries.map((episode) => {
//     //     return db.collection('gamekult').doc(episode.id).set({
//     //         ...episode
//     //     }, {merge: true})
//     // }))
//
// }