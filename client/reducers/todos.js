const todo = (state, action) => {
  switch (action.type) {

    case 'TOGGLE_TODO':
      if (state.id !== action.id) {
        return state
      }

      return Object.assign({}, state, {
        completed: !state.completed
      })
    default:
      return state
  }
}

const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        action.todo.body
      ]
    case 'TOGGLE_TODO':
      let newState = state.slice()
      state[action.index] = action.todo
      return newState
    case 'GET_TODOS':
      return action.todos
    default:
      return state
  }
}

export default todos
