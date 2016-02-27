import 'babel-polyfill';
import fetch from 'isomorphic-fetch';
import {fromJS} from 'immutable';
import {addTodo, populate, toggleTodo} from './index.js'

let getOptions = function(method, body){
  let options = {
    method: method,
    headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
  }
  if (body) options.body = JSON.stringify(body);

  return options
}

let uuid = function() {
  /*jshint bitwise:false */
  var i, random;
  var uuid = '';

  for (i = 0; i < 32; i++) {
    random = Math.random() * 16 | 0;
    if (i === 8 || i === 12 || i === 16 || i === 20) {
              uuid += '-';
            }
    uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
      .toString(16);
  }

  return uuid;
}

export function getTodos() {
 return function (dispatch) {
   return fetch('/todo/', getOptions('GET')).then(function(response){
     if(response.status >=400){
       throw new Error ("bad response from server");
     }
     return response.json();
   }).then(
     todos => {
       dispatch(populate(todos))
     },
     error => alert(error)
   );
 };
}

export function postTodo(todo) {
  let todoObj = {
    title: todo,
    id: uuid(),
    completed: false
  }
 return function (dispatch) {
   return fetch('/todo/', getOptions('POST', todoObj)).then(function(response){
     if(response.status >=400){
       throw new Error ("bad response from server");
     }
     return response.json();
   }).then(
     resp => {
       dispatch(addTodo(resp))
     },
     error => alert(error)
   );
 };
}
export function toggle(todo, index) {
  todo.completed = !todo.completed
 return function (dispatch) {
   return fetch('/todo/', getOptions('POST', todo)).then(function(response){

     if(response.status >=400){
       throw new Error ("bad response from server");
     }
     return response.json();
   }).then(
     resp => {
       dispatch(toggleTodo(resp.body, index))
     },
     error => alert(error)
   );
 };
}
