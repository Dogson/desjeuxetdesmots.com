import {combineReducers} from 'redux';
import gamesReducer from './gamesReducer';
import mediaReducer from './mediaReducer';
import usersReducer from './usersReducer';

export default combineReducers({
    gamesReducer, mediaReducer, usersReducer
});