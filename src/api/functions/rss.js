const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');
const db = admin.firestore();
const querystring = require('querystring');
const moment = require('moment');
const Parser = require("rss-parser");
let parser = new Parser();

exports.getZQSD = functions.https.onRequest((req, res) => {
    return generateZQSD()
        .then((result) => {
            res.json(result);
            console.log("bite");
        })
        .catch((error) => {
            console.log("chatte");
            console.log(error);
            res.json(error);
        })
});

async function generateZQSD() {
    const proxyUrl = "https://mighty-shelf-65365.herokuapp.com/";
    console.log(parser);
    const feed = await parser.parseURL('https://www.zqsd.fr/zqsd.xml');
    console.log(feed);
    const entries = feed.items.map(function (entry) {
        let id = entry.guid && entry.guid.replace('http://feeds.soundcloud.com/stream/', '');
        id = id && id.substring(0, id.indexOf("-"));
        if (!id) {
            id = entry.enclosure.url && entry.enclosure.url.replace('http://feeds.soundcloud.com/stream/', '');
            id = id && id.substring(0, id.indexOf("-"));
        }
        return {
            id: id,
            name: entry.title.replace('Podcast', 'ZQSD'),
            image: entry.itunes.image,
            keywords: entry.itunes.keywords,
            description: entry.itunes.summary,
            releaseDate: moment(entry.pubDate).format('YYYY-MM-DD'),
            url: "api.soundcloud.com/tracks/" + id,
            isVerified: false //TODO REMOVE !!!!!
        };
    });

    return Promise.all(entries.map((episode) => {
        return db.collection('zqsd').doc(episode.id).set({
            ...episode
        }, {merge: true})
    }))
}

exports.getGamekult = functions.https.onRequest((req, res) => {
    return generateGamekult()
        .then((result) => {
            res.json(result);
        })
        .catch((error) => {
            console.log(error);
            res.json(error);
        })
});

async function generateGamekult() {
    console.log(parser);
    const feed = await parser.parseURL('https://feeds.soundcloud.com/users/soundcloud:users:110920201/sounds.rss');
    console.log(feed);
    const entries = feed.items.map(function (entry) {
        let id = entry.guid && entry.guid.substring(entry.guid.indexOf('tracks/') + 1).replace('racks/', '');
        return {
            id: id,
            name: entry.title,
            image: entry.itunes.image,
            description: entry.itunes.summary,
            releaseDate: moment(entry.pubDate).format('YYYY-MM-DD'),
            url: "api.soundcloud.com/tracks/" + id,
            isVerified: false //TODO REMOVE !!!!!
        };
    });

    return Promise.all(entries.map((episode) => {
        return db.collection('gamekult').doc(episode.id).set({
            ...episode
        }, {merge: true})
    }))
}