import {combineReducers} from 'redux';
import gamesReducer from './gamesReducer';
import mediaReducer from './mediaReducer';
import usersReducer from './usersReducer';
import settingsReducer from './settingsReducer';

export default combineReducers({
    gamesReducer, mediaReducer, usersReducer, settingsReducer
});