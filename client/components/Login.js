import React from 'react'
import { Link, browserHistory } from 'react-router'

const Login = () => (
  <form>
    <h1>Login</h1>
    <div className="col-sm-10">
      <input type="text" className="form-control" placeholder="username"/>
    </div>
    <div className="col-sm-10">
      <input type="password" className="form-control"placeholder="password"/>
    </div>
    <div className="center">
     <Link to="/app" className="button" type="submit">Submit</Link>
    </div>
  </form>
)

    // <button type="submit" className="hidden" onClick={() => browserHistory.push('/app')}></button>
// class MyButton extends React.Component{
//     render() { return <Link to='/app'} />; }
// }
export default Login
 