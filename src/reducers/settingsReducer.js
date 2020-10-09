import {ACTIONS_SETTINGS} from "../actions/settingsActions";
import {MEDIA_LOGOS, MEDIA_TYPES} from "../config/const";

const getDefaultMediaFilter = () => {
    const res = {}
    MEDIA_LOGOS.sort((x, y) => x.name < y.name ? - 1 : 1).forEach(media => {
        res[media.name] = true;
    });
    return res;
}

const getDefaultMediaTypeFilter = () => {
    const res = {}
    MEDIA_TYPES.sort((x, y) => x.dataLabel < y.dataLabel ? - 1 : 1).forEach(type => {
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
        filters: defaultFilters
    }
}, action) => {
    switch (action.type) {
        case ACTIONS_SETTINGS.SET_FILTERED_MEDIA_SETTING:
            return {
                ...state,
                settings: {
                    ...state.settings,
                    filters: {
                        ...state.settings.filter,
                        medias: action.payload
                    }
                }
            };
        case ACTIONS_SETTINGS.SET_FILTERED_TYPES_SETTING:
            return {
                ...state,
                settings: {
                    ...state.settings,
                    filters: {
                        ...state.settings.filter,
                        types: action.payload
                    }
                }
            };
        default:
            return {
                ...state
            }
    }
}