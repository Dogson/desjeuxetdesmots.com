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
    const result = await axios({
        url: process.env.REACT_APP_API_URL + endpoint,
        method: 'GET',
        params: new URLSearchParams(params).toString(),
        headers: {
            'Accept': 'application/json',
            "X-Requested-With": "XMLHttpRequest"
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
            "X-Requested-With": "XMLHttpRequest"
        },
        data
    })
}