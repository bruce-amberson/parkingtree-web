import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import throttle from 'lodash/throttle';

import {
  createStore,
  applyMiddleware,
  compose
} from 'redux';
import { Provider } from 'react-redux';
import promise from 'redux-promise';

import { middleWare } from 'utils/helpers/middleware';
import rootReducer from 'reducers';

import { saveState, loadState } from 'utils/helpers/state_handler';

import App from 'ui';

// retreive state from sessionStorage
const cachedState = loadState();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // eslint-disable-line no-underscore-dangle

// create store
export const store = createStore(rootReducer, cachedState, composeEnhancers(
  applyMiddleware(promise, middleWare)
));

// save store to sessionStorage
store.subscribe(throttle(() => {
  saveState(store.getState());
}), 1000);

const root = ReactDOM.createRoot(document.getElementById('root'));
if (process.env.NODE_ENV !== 'test') {
  root.render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>,    
  );
}