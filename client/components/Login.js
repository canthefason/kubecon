import React from 'react'
import { Link, browserHistory } from 'react-router'

const Login = () => (
  <form action="/signin" method="post">
    <h1>Login</h1>
    <div className="col-sm-10">
      <input type="text" className="form-control username" placeholder="username"/>
    </div>
    <div className="col-sm-10">
      <input type="password" className="form-control password"placeholder="password"/>
    </div>
    <button type="submit" className="hidden submit"></button>
  </form>
)


export default Login
 