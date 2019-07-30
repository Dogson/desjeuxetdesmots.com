import {ACTIONS_GAMES} from "../actions/gamesActions";

export default (state = {}, action) => {
    switch (action.type) {
        case ACTIONS_GAMES.SET_GAMES:
            return {
                ...state,
                games: action.payload
            };
        case ACTIONS_GAMES.SET_SEARCH_INPUT:
            return {
                ...state,
                searchInput: action.payload
            }
        default:
            return {
                ...state
            }
    }
}