import {ACTIONS_SETTINGS} from "../actions/settingsActions";

export default (state = {
    settings: {
        filters: {},
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
        case ACTIONS_SETTINGS.IS_MOBILE_DRAWER_OPEN:
            return {
                ...state,
                settings: {
                    ...state.settings,
                    mobileDrawerOpen: action.payload
                }
            };
        default:
            return {
                ...state
            }
    }
}