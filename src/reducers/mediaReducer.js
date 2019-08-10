import {ACTIONS_MEDIAS} from "../actions/mediaActions";

export default (state = {}, action) => {
    switch (action.type) {
        case ACTIONS_MEDIAS.SET_ACTIVE_MEDIA:
            return {
                ...state,
                mediaActive: action.payload,
            };
        default:
            return {
                ...state
            }
    }
}