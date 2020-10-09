import {ACTIONS_SETTINGS} from "../actions/settingsActions";

export default (state = {
    settings: {
        filters: {
            medias: localStorage.getItem('filteredMedias') && JSON.parse(localStorage.getItem('filteredMedias')),
            types: localStorage.getItem('filteredTypes') && JSON.parse(localStorage.getItem('filteredTypes')),
        }
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