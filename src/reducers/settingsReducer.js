import {ACTIONS_SETTINGS} from "../actions/settingsActions";
import {MEDIA_LOGOS} from "../config/const";

const getDefaultMediaFilter = () => {
    const res = {}
    MEDIA_LOGOS.forEach(media => {
        res[media.name] = true;
    });
    return res;
}

const defaultFilters = {
    medias: getDefaultMediaFilter(),
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
                    filters: {
                        medias: {...action.payload.medias},
                    },
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