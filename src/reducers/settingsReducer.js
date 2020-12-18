import {ACTIONS_SETTINGS} from "../actions/settingsActions";

export default (state = {
    settings: {
        filters: {},
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