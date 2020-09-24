import {ACTIONS_MEDIAS} from "../actions/mediaActions";

export default (state = {}, action) => {
    switch (action.type) {
        case ACTIONS_MEDIAS.SET_MEDIAS_LIST:
            return {
                ...state,
                medias : action.payload,
            };
        case ACTIONS_MEDIAS.SET_ACTIVE_MEDIA:
            return {
                ...state,
                mediaActive: action.payload,
            };
        case ACTIONS_MEDIAS.SET_PLAYED_MEDIA:
            return {
                ...state,
                mediaPlayed: action.payload,
            };
        default:
            return {
                ...state
            }
    }
}