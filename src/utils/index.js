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
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
}