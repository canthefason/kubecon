import { combineReducers } from 'redux'
import todos from './todos'
import visibilityFilter from './visibilityFilter'
import {routerReducer} from 'react-router-redux'


const todoApp = combineReducers({
  todos,
  visibilityFilter,
  routing: routerReducer
})

export default todoApp
