import {ACTIONS_USERS} from "../actions/usersActions";

export default (state = {
    authUser: localStorage.getItem("username") && localStorage.getItem("token") && {
        username: localStorage.getItem("username"),
        token: localStorage.getItem("token")
    }
}, action) => {
    switch (action.type) {
        case ACTIONS_USERS.SET_AUTHENTICATED_USER:
            return {
                ...state,
                authUser: action.payload,
            };
        case ACTIONS_USERS.LOGOUT:
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            return {
                ...state,
                authUser: null
            }
        default:
            return {
                ...state
            }
    }
}