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
  console.log(options)
  return options
}

export function getTodos() {
 return function (dispatch) {
   return fetch('/todo', getOptions('GET')).then(function(response){

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
    text: todo,
    id: Math.random(),
    completed: false
  }
 return function (dispatch) {
   return fetch('/todo', getOptions('POST', todoObj)).then(function(response){

     if(response.status >=400){
       throw new Error ("bad response from server");
     }
     return response.json();
   }).then(
     resp => {
       dispatch(addTodo(resp.body))
     },
     error => alert(error)
   );
 };
}
export function toggle(todo, index) {
  todo.completed = !todo.completed
 return function (dispatch) {
   return fetch('/todo', getOptions('PUT', todo)).then(function(response){

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