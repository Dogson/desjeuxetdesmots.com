const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');
const db = admin.firestore();
const querystring = require('querystring');

const clientId = "YjQ0YWY2MjAwYTU5NDEwYjljOGExOTAyOWJlZjIyZDk6MjMwMTE1ZWFjMmJkNDE2MjkxZTEzNTRiYjk5NTZkNTk=";
exports.cosyCorner = {
    id: "3WRu0whFXjZoxr8jyy03UN",
    name: 'cosyCorner'
};
exports.silenceOnJoue = {
    id: "5tFF5VpV1wmsSaGTnx7pSQ",
    name: 'silenceOnJoue'
};

// process.env.GOOGLE_APPLICATION_CREDENTIALS = "C:/Users/Gwen/Downloads/API Project-8679aea3681c.json";

exports.getSpotifyAccessToken = function () {
    const config = {
        headers: {
            'Authorization': "Basic " + clientId,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
    };
    const data = {
        grant_type: "client_credentials"
    };
    return axios.post(
        `https://accounts.spotify.com/api/token`,
        querystring.stringify(data),
        config
    ).then((response) => {
        return response.data.access_token;
    })
        .catch((error) => {
            console.error(error);
        })

};

exports.copyAndWriteMediaWithOffset = function (token, offset, media) {
    const config = {
        headers: {'Authorization': "Bearer " + token}
    };
    return axios.get(
        `https://api.spotify.com/v1/shows/${media.id}/episodes?limit=50&offset=${offset}`,
        config
    ).then((response) => {
        if (response.data.items.length <= 0) {
            return;
        }
        return Promise.all(response.data.items.map((episode) => {
            return db.collection(media.name).doc(episode.id).set({
                name: episode.name,
                description: episode.description,
                url: episode.external_urls.spotify,
                image: episode.images && episode.images.length > 0 && episode.images[0].url,
                releaseDate: episode.release_date
            }, {merge: true})
        }))
        // .then(() => {
        //     return exports.copyAndWriteMediaWithOffset(token, offset + 50, media);
        // });
    })
};

exports.copyCosyCornerFromSpotify = functions.https.onRequest((req, res) => {
    getSpotifyAccessToken()
        .then((token) => {
            return exports.copyAndWriteMediaWithOffset(token, 0, exports.cosyCorner);
        })
        .then((result) => {
            res.json(result)
        })
        .catch((error) => {
            console.error(error)
        })
});

exports.copySilenceOnJoueFromSpotify = functions.https.onRequest((req, res) => {
    exports.getSpotifyAccessToken()
        .then((token) => {
            return exports.copyAndWriteMediaWithOffset(token, 0, exports.silenceOnJoue);
        })
        .then((result) => {
            res.json(result)
        })
        .catch((error) => {
            console.error(error)
        })
});