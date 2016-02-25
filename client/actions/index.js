import * as api from './actionHelpers.js'

let nextTodoId = 0
export const addTodo = (todo) => {
  return {
    type: 'ADD_TODO',
    // id: nextTodoId++,
    todo
  }
}

export const setVisibilityFilter = (filter) => {
  return {
    type: 'SET_VISIBILITY_FILTER',
    filter
  }
}

export const toggleTodo = (todo, index) => {
  return {
    type: 'TOGGLE_TODO',
    todo, 
    index
  }
}

export const toggleTodoAPI = (id, index) => {
 return function (dispatch){
    return dispatch(
      api.toggle(id, index)
    )
  }
}

export function getTodos() {
  return function (dispatch){
    return dispatch(
      api.getTodos()
    )
  }
}
export const populate = (todos) => {
  return {
    type: 'GET_TODOS',
    todos
  }
}

export function postTodo(todo) {
  return function (dispatch){
    return dispatch(
      api.postTodo(todo)
    )
  }
}
