import React, { PropTypes } from 'react'
import classnames from 'classnames'

const Todo = ({ onClick, completed, title }) => (
  <li className={classnames({completed: completed})}>
  <div className="view"
    onClick={onClick}

  >
    {title}
    </div>
  </li>
)

Todo.propTypes = {
  onClick: PropTypes.func.isRequired,
  completed: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired
}

export default Todo

    // style={{
    //   textDecoration: completed ? 'line-through' : 'none'
    // }}
    // className={classNames({selected: nowShowing === app.ALL_TODOS})}
