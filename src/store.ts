import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from 'reducers/rootReducer';
import rootSaga from 'sagas/rootSaga';

// TODO: Redux Dev Tools should only be available in dev environments
// NOT allowed on production environments.

const sagaMiddleware = createSagaMiddleware();

function configureStore() {
  const middleware = [sagaMiddleware];
  console.log('env', process.env.NODE_ENV);
  switch (process.env.NODE_ENV) {
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
