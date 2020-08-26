const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');
const db = admin.firestore();
const querystring = require('querystring');
const moment = require('moment');
const Parser = require("rss-parser");
let parser = new Parser();
let _ = require("lodash");

exports.getZQSD = functions.https.onRequest((req, res) => {
    return generateZQSD()
        .then((result) => {
            res.json(result);
        })
        .catch((error) => {
            console.log(error);
            res.json(error);
        })
});

async function generateZQSD() {
    const proxyUrl = "https://mighty-shelf-65365.herokuapp.com/";
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
            url: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/" + id,
            hasGeneratedGames: false,
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
    const feed = await parser.parseURL('https://feeds.soundcloud.com/users/soundcloud:users:110920201/sounds.rss');
    const entries = feed.items.map(function (entry) {
        let id = entry.guid && entry.guid.substring(entry.guid.indexOf('tracks/') + 1).replace('racks/', '');
        return {
            id: id,
            name: entry.title,
            image: entry.itunes.image,
            description: entry.itunes.summary,
            releaseDate: moment(entry.pubDate).format('YYYY-MM-DD'),
            url: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/" + id,
            isVerified: false, //TODO REMOVE !!!!!
            hasGeneratedGames: false
        };
    });

    return Promise.all(entries.map((episode) => {
        return db.collection('gamekult').doc(episode.id).set({
            ...episode
        })
    }))
}

exports.getSilenceOnJoue = functions.https.onRequest((req, res) => {
    return generateSilenceOnJoue()
        .then((result) => {
            res.json(result);
        })
        .catch((error) => {
            console.log(error);
            res.json(error);
        })
});

async function generateSilenceOnJoue() {
    const feed = await parser.parseURL("https://feeds.acast.com/public/shows/5b7ac427c6a58e726f576cff");
    const entries = feed.items.map(function (entry) {
        return {
            id: entry.guid,
            name: entry.title,
            image: entry.itunes.image,
            description: strip_html_tags(entry.itunes.summary).substring(0, strip_html_tags(entry.itunes.summary).indexOf('Voir Acast')),
            releaseDate: moment(entry.pubDate).format('YYYY-MM-DD'),
            url: `https://player.acast.com/5b7ac427c6a58e726f576cff/episodes/${entry.guid}`,
            hasGeneratedGames: false,
            isVerified: false //TODO REMOVE !!!!!
        };
    })
        .filter((entry) => entry.id.indexOf("//") === -1);

    return Promise.all(entries.map((episode) => {
        return db.collection('silenceOnJoue').doc(episode.id).set({
            ...episode
        }, {merge: true})
    }))
}

exports.getCosyCorner = functions.https.onRequest((req, res) => {
    return generateCosyCorner()
        .then((result) => {
            res.json(result);
        })
        .catch((error) => {
            console.log(error);
            res.json(error);
        })
});

async function generateCosyCorner() {
    const feed = await parser.parseURL("https://feeds.soundcloud.com/users/soundcloud:users:274829367/sounds.rss");
    const entries = feed.items.map(function (entry) {
        let id = entry.guid && entry.guid.substring(entry.guid.indexOf('tracks/') + 1).replace('racks/', '');
        return {
            id: id,
            name: entry.title,
            image: entry.itunes.image,
            description: entry.itunes.summary,
            releaseDate: moment(entry.pubDate).format('YYYY-MM-DD'),
            url: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/" + id,
            isVerified: false, //TODO REMOVE !!!!!
            hasGeneratedGames: false
        };
    });

    return Promise.all(entries.map((episode) => {
        return db.collection('cosyCorner').doc(episode.id).set({
            ...episode
        })
    }))
}

function strip_html_tags(str) {
    if ((str == null) || (str === ''))
        return false;
    else
        str = str.toString();
    str = _.unescape(str.replace(/<\/?[^>]+(>|$)/g, ""));
    str = str.replace(/&nbsp;/g, ' ');
    return str;
}
