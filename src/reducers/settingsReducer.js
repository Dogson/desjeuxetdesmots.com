import {ACTIONS_SETTINGS} from "../actions/settingsActions";

export default (state = {
    settings: {
        filters: {
            types: {"podcast": true, "video": true}
        },
        remember: false,
    },
    cookieConsent: localStorage.getItem('cookie-consent')
}, action) => {
    switch (action.type) {
        case ACTIONS_SETTINGS.SET_FILTERED_VALUES:
            return {
                ...state,
                settings: {
                    ...state.settings,
                    filters: {
                        types: {
                            ...action.payload.types
                        }
                    },
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
        case ACTIONS_SETTINGS.SET_COOKIE_CONSENT:
            localStorage.setItem('cookie-consent', action.payload);
            return {
                ...state,
                cookieConsent: action.payload
            };
        default:
            return {
                ...state
            }
    }
}