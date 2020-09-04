const moment = require('moment');

const axios = require('axios');

const config = require('./config').appConfig;
const {IGDB_API} = config;

exports.getVideoGamesFromString = (string, mediaConfig) => {
    return getGamesForMedia(string, mediaConfig);
}


async function getGamesForMedia(string, mediaConfig) {
    let games = [];
    let ignoreEpisode = false;
    mediaConfig.ignoreEpisode.forEach((str) => {
        if (string.indexOf(str) > -1) {
            ignoreEpisode = true;
        }
    });
    if (ignoreEpisode) {
        return [];
    }
    string = parseDescription(string, mediaConfig);
    let words = string.split(/\s+/);
    games = await getGamesFromArray(words);
    return games;
}

async function getGamesFromArray(words) {
    let resultGames = [];
    for (let i = 0; i < words.length; i++) {
        let word = words[i];
        let exactGameTitle;
        let j = i;
        let matchingGames = [];
        if (word.length <= 4) {
            j++;
            word = word + " " + words[j]
        }
        matchingGames = await getAllPartiallyMatchingGames(word);
        let matchingStr = word;
        let nonEmptyMatchingGames;
        if (matchingGames.length > 0) {
            nonEmptyMatchingGames = matchingGames;
            // On itère en ajoutant des mots, jusqu'à ce qu'on ne trouve plus que 1 ou 0 résultat
            while (matchingGames.length > 0 && j - 1 < words.length) {
                j++;
                const newMatchingStr = matchingStr + " " + words[j];
                matchingGames = await getAllPartiallyMatchingGames(newMatchingStr, matchingGames);
                if (matchingGames.length > 0) {
                    matchingStr = newMatchingStr;
                    //On récupère le dernier array non vide des matchingGames
                    nonEmptyMatchingGames = matchingGames;
                }
            }

            //On vérifie si le dernier nonEmptyMatchingGames contient le titre en entier
            if (nonEmptyMatchingGames) {
                exactGameTitle = getExactMatchingGame(matchingStr, nonEmptyMatchingGames);
                if (exactGameTitle && resultGames.indexOf(exactGameTitle) === -1) {
                    resultGames.push(exactGameTitle);
                    i = j - 1;
                }
            }
        }
    }
    return resultGames;
};

const getExactMatchingGame = (string, matchingGames) => {
    return matchingGames.find((game) => game.name.toUpperCase() === string.toUpperCase())
}

// Looks for string occurences in matchingGames
// If matchingGames is not set, looks for string occurences in API Call
async function getAllPartiallyMatchingGames(string, matchingGames) {
    const proxyUrl = "https://mighty-shelf-65365.herokuapp.com/";
    let key = IGDB_API.key;
    let endpointName = "games";
    let url = `${proxyUrl}${IGDB_API.url}${endpointName}`;

    if (matchingGames) {
        return matchingGames.filter((game) => {
            return game.name.toUpperCase().indexOf(string.toUpperCase() + " ") === 0 || game.name.toUpperCase() === string.toUpperCase();
        })
    } else {
        // debugger;
        return axios({
            url: url,
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'user-key': key,
                "X-Requested-With": "XMLHttpRequest"
            },
            data: `fields name, cover.url, screenshots.url, release_dates.date; sort popularity desc; where themes!= (42) & name~"${string}"* & popularity > 1; limit 50;`
        })
            .then((response) => {
                return response.data.length === 0 ? [] : mappedGames(response.data);
            })
    }
}

function mappedGames(games) {
    return games
        .filter((game) => {
            return game.release_dates && game.cover && game.screenshots;
        })
        .map((game) => {
            let result = {
                ...game,
                cover: game.cover && game.cover.url.replace('/t_thumb/', '/t_cover_big/').replace('//', 'https://'),
                screenshot: game.screenshots && game.screenshots.length && game.screenshots[game.screenshots.length - 1].url.replace('/t_thumb/', '/t_screenshot_big/').replace('//', 'https://'),
                releaseDate: game.release_dates && Math.min(...game.release_dates && game.release_dates.map((release_date) => {
                        return release_date.date;
                    })
                        .filter((date) => {
                            return date != null;
                        })
                )
            };
            delete result.release_dates;
            delete result.screenshots;
            return result;
        })
}

const parseDescription = (str, mediaConfig) => {
    str = str.toUpperCase();
    let parsed = removeExcludedRegex(str, mediaConfig);
    parsed = removeSpecialCharacters(parsed);
    parsed = removeEndOfParse(parsed, mediaConfig);
    parsed = removeUselessWhiteSpaces(parsed);
    parsed = removedExcludedStrings(parsed, mediaConfig);

    return parsed;
};

const removedExcludedStrings = (str, mediaConfig) => {
    let result = str;
    mediaConfig.excludeStrings.forEach((string) => {
        result = result.replace(string.toUpperCase(), "");
    });

    return result;
};


const removeExcludedRegex = (str, mediaConfig) => {
    let result = str;
    mediaConfig.excludeRegex.forEach((regex) => {
        result = result.replace(regex, "");
    });

    return result;
};

const removeEndOfParse = (str, mediaConfig) => {
    let result = str;
    mediaConfig.endOfParseStrings.forEach((endOfParse) => {
        if (result.indexOf(endOfParse.toUpperCase()) > -1) {
            result = result.substring(0, result.indexOf(endOfParse.toUpperCase()));
        }
    });

    return result;
};

const removeSpecialCharacters = (str) => {
    return str.replace(/[`~!@#$%^&*()_|+=?;«»'",.<>\{\}\[\]\\\/]/gi, '');
};

const removeUselessWhiteSpaces = (str) => {
    return str.replace(/\s+(\W)/g, "$1");
}