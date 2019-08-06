const moment = require('moment');

const axios = require('axios');

const IGDB_API = {
    url: "https://api-v3.igdb.com/",
    key: "bf136b87b5fff2ab005efc2c5f06e70d"
};

exports.getVideoGamesFromString = ((string, {excludeStrings, endOfParseStrings}) => {
    return getGamesAsync(string, {excludeStrings, endOfParseStrings});
});


let hit = 0;
async function getGamesAsync(string, {excludeStrings, endOfParseStrings}) {
    const punctuations = ":, ?, !, ., &";
    for (let i = 0; i < excludeStrings.length; i++) {
        if (string.indexOf(excludeStrings[i]) >= 0) {
            return Promise.resolve([]);
        }
    }

    string = string.replace(/ \[.*?\]/g, '');

    // Removing useless part
    for (let i = 0; i < endOfParseStrings.length; i++) {
        string = string.split(endOfParseStrings[i])[0];
    }

    const arrayString = string.split(/[ ,-]+/);
    let games = [];

    for (let i = 0; i < arrayString.length; i++) {
        const word = arrayString[i];
        let wordPartialMatches = word.length ? word[0].toUpperCase() === word[0] : false;
        wordPartialMatches = wordPartialMatches && (word.length > 3 ? await hasPartialMatch(word) : []);
        if (wordPartialMatches) {
            let hasMatch = true;
            let assembledWords = word;
            let j = i + 1;
            let partialResults;
            if (wordPartialMatches.length < 50 && wordPartialMatches.length > 0) {
                partialResults = wordPartialMatches;
            }
            while (hasMatch) {
                assembledWords += " " + arrayString[j];
                if (arrayString[j] && arrayString[j].length > 3 && arrayString[j][0] !== arrayString[j][0].toUpperCase()) {
                    hasMatch = false;
                    assembledWords = assembledWords.split(" " + arrayString[j])[0];
                    j++;
                    break;
                }
                if (arrayString[j] && punctuations.indexOf(arrayString[j][0]) > -1) {
                    hasMatch = false;
                    assembledWords = assembledWords.split(" " + arrayString[j])[0];
                    j++;
                    break;
                }
                let partialMatchAssembled = partialResults ? partialResults.filter((result) => {
                    return result.name.toUpperCase().indexOf(assembledWords.toUpperCase()) !== -1
                }) : await hasPartialMatch(assembledWords);
                if (partialMatchAssembled && partialMatchAssembled.length < 50 && partialMatchAssembled.length > 0) {
                    partialResults = partialMatchAssembled;
                }
                if (!partialMatchAssembled || partialMatchAssembled.length <= 0) {
                    hasMatch = false;
                    assembledWords = assembledWords.split(" " + arrayString[j])[0];
                }
                j++;
            }
            let exactMatchGames = assembledWords.length > 3;
            exactMatchGames = exactMatchGames && (partialResults ? partialResults.find((result) => {
                return result.name.toUpperCase() === assembledWords.toUpperCase()
            }) : await hasExactMatch(assembledWords));
            if (exactMatchGames) {
                if (exactMatchGames.cover && exactMatchGames.release_dates) {
                    const game = {
                        ...exactMatchGames,
                        cover: exactMatchGames.cover && exactMatchGames.cover.url.replace('/t_thumb/', '/t_cover_big/').replace('//', 'https://'),
                        releaseDate: (exactMatchGames.release_dates && exactMatchGames.release_dates[0] && exactMatchGames.release_dates[0].date) || null
                    };
                    delete game.release_dates;
                    games.push(game);
                    i = j - 2;
                }
            }
        }
    }
    return games;
}

async function hasPartialMatch(string) {
    hit++;
    const proxyUrl = "https://mighty-shelf-65365.herokuapp.com/";
    let key = IGDB_API.key;
    let endpointName = "games";
    let url = `${proxyUrl}${IGDB_API.url}${endpointName}`;

    return axios({
        url: url,
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'user-key': key,
            "X-Requested-With": "XMLHttpRequest"
        },
        data: `fields name, cover.url, release_dates.date; sort popularity desc; where themes!= (42) & name~*"${string}"* & popularity > 1; limit 50;`
    })
        .then((response) => {
            return response.data.length === 0 ? null : response.data;
        })
}

async function hasExactMatch(string) {
    hit++;
    const proxyUrl = "https://mighty-shelf-65365.herokuapp.com/";
    let key = IGDB_API.key;
    let endpointName = "games";
    let url = `${proxyUrl}${IGDB_API.url}${endpointName}`;

    return axios({
        url: url,
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'user-key': key,
            "X-Requested-With": "XMLHttpRequest"
        },
        data: `fields name, cover.url, release_dates.date; sort popularity desc; where themes!= (42) & name~"${string}" & popularity > 1; limit 50;`
    })
        .then((response) => {
            const games = response.data;
            if (games.length) {
                return games[0];
            }
            return null;
        })
}