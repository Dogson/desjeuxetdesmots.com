import axios from 'axios';
import {IGBD_API} from "../config/apiConfig";

export const getAllPopularGames = () => {
    const proxyUrl = "https://mighty-shelf-65365.herokuapp.com/";
    let key = IGBD_API.key;
    let endpointName = "games";
    let url = `${proxyUrl}${IGBD_API.url}${endpointName}`;
    console.log(url);


    return axios({
        url: url,
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'user-key': key,
            "X-Requested-With": "XMLHttpRequest"
        },
        data: "fields name, age_ratings, cover.url; sort popularity desc; where themes!= (42); limit: 50;"
    })
        .then(response => {
            return response.data.map((game) => {
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