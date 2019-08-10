import {combineReducers} from 'redux';
import gamesReducer from './gamesReducer';
import mediaReducer from './mediaReducer';

export default combineReducers({
    gamesReducer, mediaReducer
});