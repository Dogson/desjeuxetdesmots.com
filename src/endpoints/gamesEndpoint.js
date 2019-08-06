import axios from 'axios';
import {IGDB_API} from "../config/apiConfig";
import moment from "moment";
import * as firebase from 'firebase';

require('firebase/firestore');

require("../config/firebase");

const db = firebase.firestore();

const offset = 28;

const getAllGames = ({lastDoc}) => {
    let ref = db.collection('games').orderBy("releaseDate", "desc");
    if (lastDoc) {
        ref = ref.startAfter(lastDoc);
    }
    ref = ref.limit(offset);
    return ref.get()
        .then((snap) => {
            return {
                games: snap.docs.map((doc) => {
                    return doc.data();
                }).map((game) => {
                return {...game, releaseDate: game.releaseDate ? moment.unix(game.releaseDate) : "A venir"}
                }).sort((gameX, gameY) => {
                    if (gameX.name === "Star Citizen" || gameY.name === "Star Citizen") {
                        debugger;
                    }
                    return gameX.releaseDate === "A venir" ? -1 : gameY.releaseDate === "A venir" ? 2 : gameY.releaseDate - gameX.releaseDate
                }),
                lastDoc: snap.docs && snap.docs[snap.docs.length - 1]
            }
        })

        .catch((error) => {
            console.log(error);
        })
};

export const getGamesBySearch = ({search, lastDoc}) => {
    if (!search || search.length <= 0) {
        return getAllGames({lastDoc});
    }
    let ref = db.collection('games')
        .orderBy("searchableName")
        .startAt(search.toUpperCase()).endAt(search.toUpperCase() + "\uf8ff");
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
