import * as axios from "axios";

export async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

export async function post(endpoint, data) {
    return await axios({
        url: process.env.REACT_APP_API_URL + endpoint,
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            "X-Requested-With": "XMLHttpRequest"
        },
        data
    })
}

export async function get(endpoint, params) {
    params = params && _parseParams(params);
    const result = await axios({
        url: process.env.REACT_APP_API_URL + endpoint,
        method: 'GET',
        params: params && new URLSearchParams(params),
        headers: {
            'Accept': 'application/json',
            "X-Requested-With": "XMLHttpRequest",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
    });
    return result.data;
}

export async function remove(endpoint) {
    return await axios({
        url: process.env.REACT_APP_API_URL + endpoint,
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            "X-Requested-With": "XMLHttpRequest"
        },
    })
}

export async function put(endpoint, data) {
    return await axios({
        url: process.env.REACT_APP_API_URL + endpoint,
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            "X-Requested-With": "XMLHttpRequest",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        data
    })
}

function _parseParams(params) {
    Object.keys(params).forEach((key) => {
        if (params[key] == null) {
            delete params[key];
        }
    });
    return params;
}


export function findPos(el) {
    let _x = 0;
    let _y = 0;
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return {top: _y, left: _x};
}

export function isValidUrl(str) {
    if (str.indexOf("http") === -1) {
        return false
    }
    const res = str.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/g);
    return (res !== null)
}

export function shuffleArray(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}