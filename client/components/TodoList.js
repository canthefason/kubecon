import React, { Component, PropTypes } from 'react'
import Todo from './Todo'

// const TodoList = ({ todos, onTodoClick }) => (
//   <section className="main">
//   <ul className="todo-list">
//     {todos.map(todo =>
//       <Todo
//         key={todo.id}
//         {...todo}
//         onClick={() => onTodoClick(todo.id)}
//       />
//     )}
//   </ul>
//   </section>
// )
class TodoList extends Component {
  componentDidMount(){
    this.props.onLoad()
  }
  render(){
    const {todos,onTodoClick} = this.props
    return(
      <section className="main">
      <ul className="todo-list">
        {todos.map((todo, i) =>
          <Todo
            key={todo.id}
            {...todo}
            onClick={() => onTodoClick(todo, i)}
          />
        )}
      </ul>
      </section>
    )

  }
}

TodoList.propTypes = {
  todos: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired
  }).isRequired).isRequired,
  onTodoClick: PropTypes.func.isRequired
}

export default TodoList
