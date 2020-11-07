import {ACTIONS_MEDIAS} from "../actions/mediaActions";

export default (state = {
    playState: {
        isPaused: true,
        audioContextPaused: true
    }
}, action) => {
    switch (action.type) {
        case ACTIONS_MEDIAS.SET_MEDIAS_LIST:
            return {
                ...state,
                medias: action.payload,
            };
        case ACTIONS_MEDIAS.SET_ACTIVE_EPISODE:
            return {
                ...state,
                episodeActive: action.payload,
            };
        case ACTIONS_MEDIAS.SET_PLAYED_MEDIA:
            return {
                ...state,
                mediaPlayed: action.payload,
            };
        case ACTIONS_MEDIAS.SET_PLAY_STATE:
            return {
                ...state,
                playState: action.payload,
            };
        default:
            return {
                ...state
            }
    }
}