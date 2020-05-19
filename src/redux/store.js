import { createStore, applyMiddleware } from 'redux';
import { persistStore } from 'redux-persist';
import { createLogger } from 'redux-logger';

import rootReducer from './rootReducer';

export const store = createStore(rootReducer, applyMiddleware(createLogger()));

export const persistor = persistStore(store);

export default { store, persistor };