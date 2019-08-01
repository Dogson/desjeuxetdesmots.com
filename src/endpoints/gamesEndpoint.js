import axios from 'axios';
import {IGDB_API} from "../config/apiConfig";
import moment from "moment";

export const getAllPopularGames = () => {
    return Promise.resolve([]);
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
        data: "fields name, cover.url, release_dates.date; sort popularity desc; where themes!= (42) & popularity > 2; limit: 49;"
    })
        .then(response => {
            return response.data.filter((game) => {
                return game.cover;
            }).map((game) => {
                return {
                    ...game,
                    cover: game.cover.url.replace('/t_thumb/', '/t_cover_big/').replace('//', 'https://'),
                    releaseDate: game.release_dates && moment.unix(Math.min(...game.release_dates.map((release_date) => {
                            return release_date.date;
                        }).filter((date) => {
                            return !!date;
                        })
                    )).format('YYYY')
                }
            })
        })
        .catch(err => {
            console.error(err);
        });
};

export const getGamesBySearch = (search) => {
    // return Promise.resolve([]);
    if (!search || search.length < 1) {
        return getAllPopularGames();
    }
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
        data: `fields name, cover.url, release_dates.date, popularity; sort popularity desc; where themes!= (42) & name~*"${search}"*;limit: 49;`
    })
        .then(response => {
            return response.data.filter((game) => {
                return game.cover;
            }).map((game) => {
                return {
                    ...game,
                    cover: game.cover.url.replace('/t_thumb/', '/t_cover_big/').replace('//', 'https://'),
                    releaseDate: game.release_dates && moment.unix(Math.min(...game.release_dates.map((release_date) => {
                            return release_date.date;
                        }).filter((date) => {
                            return !!date;
                        })
                    )).format('YYYY')
                }
            })
        })
        .catch(err => {
            console.error(err);
        });
};
