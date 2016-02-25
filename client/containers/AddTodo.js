import React from 'react'
import { connect } from 'react-redux'
import { postTodo } from '../actions'


let AddTodo = ({ dispatch }) => {
  let input

  return (
    <header className="header">
    <h1>Todos</h1>
      <form onSubmit={e => {
        e.preventDefault()
        if (!input.value.trim()) {
          return
        }
        dispatch(postTodo(input.value))
        input.value = ''
      }}>
        <input className="new-todo" placeholder="Things to do..." ref={node => {
          input = node
        }} />
      </form>
    </header>
  )
}

AddTodo = connect()(AddTodo)

export default AddTodo
