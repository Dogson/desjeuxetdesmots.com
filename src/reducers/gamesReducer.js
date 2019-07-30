import {ACTIONS_GAMES} from "../actions/gamesActions";

export default (state = {}, action) => {
    switch (action.type) {
        case ACTIONS_GAMES.SET_GAMES:
            console.log(action.payload);
            return {
                ...state,
                games: action.payload
            };
        default:
            return {
                ...state
            }
    }
}