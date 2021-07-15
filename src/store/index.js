import { createBrowserHistory } from 'history'
import createSagaMiddleware from 'redux-saga'
import { createLogger } from 'redux-logger'
import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import authMiddleware from 'store/middlewares/auth'
import reducers from './reducers'
import sagas from './sagas'

// Create a history of your choosing (we're using a browser history in this case)
export const history = createBrowserHistory()

// Build the middleware for intercepting and dispatching navigation actions
const middleware = routerMiddleware(history)

// Redux-saga middleware
const sagaMiddleware = createSagaMiddleware()

let middlewares = [middleware, sagaMiddleware, authMiddleware]

// Redux-logger middleware
if (process.env.NODE_ENV !== 'production') {
  const loggerMiddleware = createLogger({ collapsed: true })
  middlewares.push(loggerMiddleware)
}

const enhancers = [applyMiddleware(...middlewares)]

// If Redux DevTools Extension is installed use it, otherwise use Redux compose
/* eslint-disable no-underscore-dangle */
const composeEnhancers =
  process.env.NODE_ENV !== 'production' && typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose
/* eslint-enable */

export const store = createStore(reducers, composeEnhancers(...enhancers))

// Run saga middleware
sagaMiddleware.run(sagas)
