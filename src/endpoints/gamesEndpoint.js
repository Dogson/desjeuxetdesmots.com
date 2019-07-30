import axios from 'axios';
import {IGBD_API} from "../config/apiConfig";

export const getAllPopularGames = () => {
    const proxyUrl = "https://mighty-shelf-65365.herokuapp.com/";
    let key = IGBD_API.key;
    let endpointName = "games";
    let url = `${proxyUrl}${IGBD_API.url}${endpointName}`;

    return axios({
        url: url,
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'user-key': key,
            "X-Requested-With": "XMLHttpRequest"
        },
        data: "fields name, cover.url; sort popularity desc; where themes!= (42) & popularity > 2; limit: 50;"
    })
        .then(response => {
            return response.data.filter((game) => {
                return game.cover;
            }).map((game) => {
                return {
                    ...game,
                    cover: game.cover.url.replace('/t_thumb/', '/t_cover_big/').replace('//', 'https://')
                }
            })
        })
        .catch(err => {
            console.error(err);
        });
};

export const getGamesBySearch = (search) => {
    if (!search || search.length < 1) {
        return getAllPopularGames();
    }
    const proxyUrl = "https://mighty-shelf-65365.herokuapp.com/";
    let key = IGBD_API.key;
    let endpointName = "games";
    let url = `${proxyUrl}${IGBD_API.url}${endpointName}`;

    return axios({
        url: url,
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'user-key': key,
            "X-Requested-With": "XMLHttpRequest"
        },
        data: `fields name, cover.url; sort popularity desc; where themes!= (42) & name~*"${search}"* & popularity > 2; limit: 50;`
    })
        .then(response => {
            return response.data.filter((game) => {
                return game.cover;
            }).map((game) => {
                return {
                    ...game,
                    cover: game.cover.url.replace('/t_thumb/', '/t_cover_big/').replace('//', 'https://')
                }
            })
        })
        .catch(err => {
            console.error(err);
        });
};