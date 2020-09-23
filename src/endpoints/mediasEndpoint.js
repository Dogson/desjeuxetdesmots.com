import firebase from "../config/firebase";
import {get} from "../utils";
import {API_CONFIG} from "../config/apiConfig";

const db = firebase.firestore();
if (window.location.hostname === "localhost") {
    db.settings({
        host: "localhost:8080",
        ssl: false
    });
}
const functions = firebase.functions();


export const getNumberOfMedia = ({mediaDataLabel}) => {
    return db.collection("itemsNumber").doc(mediaDataLabel).get()
        .then((doc) => {
            return doc.exists ? doc.data() : 0;
        }).catch(function (error) {
            console.error("Error getting document:", error);
        });
};

export async function getAllMedia(mediaDataLabel) {
    const medias = await get(API_CONFIG.endpoints.MEDIA, {"media.type": mediaDataLabel});
    return _sortEpisodesByMedia(medias);
}

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

const _sortEpisodesByMedia = (episodes) => {
    const medias = [];
    episodes.forEach((episode) => {
        const index = medias.findIndex((med) => med.name === episode.media.name);
        if (index > -1) {
            medias[index].episodes.push(episode);
        } else {
            medias.push({
                ...episode.media,
                episodes: [episode]
            })
        }
    });
    return medias;
};