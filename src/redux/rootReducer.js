import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import releaseReducer from './reducers/releaseReducer';
import taskReducer from './reducers/taskReducer';

const rootReducer = combineReducers({
    release: releaseReducer,
    task : taskReducer,
});

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['release', 'task'],
}

export default persistReducer(persistConfig, rootReducer);