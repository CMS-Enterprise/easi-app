import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';

import rootReducer from 'reducers/rootReducer';
import rootSaga from 'sagas/rootSaga';

const sagaMiddleware = createSagaMiddleware();

function configureStore() {
  const middleware = [sagaMiddleware];

  switch (import.meta.env.NODE_ENV) {
    case 'development':
      return createStore(
        rootReducer,
        composeWithDevTools(applyMiddleware(...middleware))
      );
    case 'test':
      return createStore(
        rootReducer,
        composeWithDevTools(applyMiddleware(...middleware))
      );
    case 'production':
      return createStore(rootReducer, applyMiddleware(...middleware));
    default:
      return createStore(rootReducer, applyMiddleware(...middleware));
  }
}

const store = configureStore();

sagaMiddleware.run(rootSaga);

export default store;
