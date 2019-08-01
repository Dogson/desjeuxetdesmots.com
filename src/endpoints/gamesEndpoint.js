import axios from 'axios';
import {IGDB_API} from "../config/apiConfig";
import moment from "moment";
import * as firebase from 'firebase';
require('firebase/firestore');

require("../config/firebase");

const db = firebase.firestore();

const offset = 28;

export const getAllGames = ({lastDoc}) => {
    let ref = db.collection('games').orderBy("releaseDate", "desc").limit(offset);
    if (lastDoc) {
        debugger;
        ref = ref.startAfter(lastDoc);
    }
  return ref.get()
      .then((snap) => {
          return {
              games: snap.docs.map((doc) => {
                  return doc.data();
              }).sort((gameX, gameY) => {
                  return gameY.releaseDate - gameX.releaseDate
              }),
              lastDoc: snap.docs && snap.docs[snap.docs.length - 1]
          }
      })

      .catch((error) => {
          console.log(error);
      })
};

export const getGamesBySearch = (search) => {
    // return Promise.resolve([]);
    if (!search || search.length < 1) {
        return getAllGames();
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
