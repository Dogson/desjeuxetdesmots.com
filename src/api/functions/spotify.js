const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');
const db = admin.firestore();
const querystring = require('querystring');

const clientId = "YjQ0YWY2MjAwYTU5NDEwYjljOGExOTAyOWJlZjIyZDk6MjMwMTE1ZWFjMmJkNDE2MjkxZTEzNTRiYjk5NTZkNTk=";
const cosyCornerId = "3WRu0whFXjZoxr8jyy03UN";

process.env.GOOGLE_APPLICATION_CREDENTIALS = "C:/Users/Gwen/Downloads/API Project-8679aea3681c.json";

function getSpotifyAccessToken() {
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
            console.log(error);
        })

}

exports.getCosyCornerShowsFromSpotify = functions.https.onRequest((req, res) => {
    getSpotifyAccessToken()
        .then((token) => {
            const config = {
                headers: {'Authorization': "Bearer " + token}
            };
            return axios.get(
                `https://api.spotify.com/v1/shows/${cosyCornerId}`,
                config
            );
        })
        .then((response) => {
            response.data.episodes.items.forEach((episode) => {
                db.collection('cosyCorner').doc(episode.id).set({
                    name: episode.name,
                    description: episode.description,
                    url: episode.external_urls.spotify,
                    image: episode.images && episode.images.length > 0 && episode.images[0].url,
                    releaseDate: episode.release_date
                })
                    .then((result) => {
                        console.log(result);
                    })
                    .catch((error) => {
                        console.log(error);
                    });

                db.collection("cosyCorner").get().then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                        console.log(doc.id, " => ", doc.data());
                    });
                });
            });
            res.json(response.data.episodes);
            // return res.json(response.episodes.items.length);
        }).catch((error) => {
        console.log(error);
    });
});