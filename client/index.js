import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import Immutable from 'immutable'

import todoApp from './reducers'
import App from './components/App'
import './styles/index.css'
import './styles/mvc-app.css'
import './styles/mvc-base.css'


let middleware = [thunk]

if (process.env.NODE_ENV !== 'production') {
  let createLogger = require('redux-logger')
  const logger = createLogger({
    stateTransformer: (state) => {
      var newState = {}
      for (var i of Object.keys(state)) {
        if (Immutable.Iterable.isIterable(state[i])) {
          newState[i] = state[i].toJS()
        } else {
          newState[i] = state[i]
        }
      }
      return newState
    }
  })
  middleware = [...middleware, logger]
}

const createStoreWithMiddleware = applyMiddleware(...middleware)(createStore)

const store = createStoreWithMiddleware(todoApp)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
