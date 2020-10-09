import {ACTIONS_SETTINGS} from "../actions/settingsActions";
import {MEDIA_LOGOS, MEDIA_TYPES} from "../config/const";

const getDefaultMediaFilter = () => {
    const res = {}
    MEDIA_LOGOS.forEach(media => {
        res[media.name] = true;
    });
    return res;
}

const getDefaultMediaTypeFilter = () => {
    const res = {}
    MEDIA_TYPES.forEach(type => {
        res[type.dataLabel] = true;
    });
    return res;
}

const defaultFilters = {
    medias: localStorage.getItem('filteredMedias') ? JSON.parse(localStorage.getItem('filteredMedias')) : getDefaultMediaFilter(),
    types: localStorage.getItem('filteredTypes') ? JSON.parse(localStorage.getItem('filteredTypes')) : getDefaultMediaTypeFilter(),
}

export default (state = {
    settings: {
        filters: defaultFilters,
        remember: false
    }
}, action) => {
    switch (action.type) {
        case ACTIONS_SETTINGS.SET_FILTERED_VALUES:
            return {
                ...state,
                settings: {
                    ...state.settings,
                    filters: action.payload
                }
            };
        case ACTIONS_SETTINGS.SET_REMEMBER:
            return {
                ...state,
                settings: {
                    ...state.settings,
                    remember: action.payload
                }
            };
        default:
            return {
                ...state
            }
    }
}