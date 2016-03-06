import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import Immutable from 'immutable'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'

import { syncHistoryWithStore, routerMiddleware} from 'react-router-redux'

import todoApp from './reducers'
import App from './components/App'
import Login from './components/Login'
import AppContainer from './containers/AppContainer'
import './styles/index.css'
import './styles/mvc-app.css'
import './styles/mvc-base.css'


// let t = routerMiddleware(browserHistory)
let middleware = [thunk]

if (process.env.NODE_ENV !== 'production') {
  let createLogger = require('redux-logger')
  const logger = createLogger()
  middleware = [...middleware, logger]
}
const createStoreWithMiddleware = applyMiddleware(...middleware)(createStore)

const store = createStoreWithMiddleware(todoApp)

const history = syncHistoryWithStore(browserHistory, store)

render(
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={AppContainer}>
        <IndexRoute component={Login} />
        <Route path="app" component={App}/>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
)
        // <Route path="app" component={App}/>
