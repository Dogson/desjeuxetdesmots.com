import {ACTIONS_GAMES} from "../actions/gamesActions";

export default (state = {}, action) => {
    switch (action.type) {
        case ACTIONS_GAMES.SET_GAMES:
            return {
                ...state,
                games: action.payload.games,
                page: action.payload.page || 1
            };
        case ACTIONS_GAMES.SET_SEARCH_INPUT:
            return {
                ...state,
                searchInput: action.payload
            };
        case ACTIONS_GAMES.SET_CURRENT_GAME:
            console.log(action);
            return {
                ...state,
                currentGame: action.payload
            };
        default:
            return {
                ...state
            }
    }
}