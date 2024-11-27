// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import App from './components/App';
import reducers from './reducers';

// Create the Redux store to manage our application state
const store = createStore(
    reducers,
    applyMiddleware(ReduxThunk)
);

// Use the standard ReactDOM.render method which is compatible with older React versions
ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);