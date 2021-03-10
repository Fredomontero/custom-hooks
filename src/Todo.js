import React from 'react';
import './Todo.css';

export const Todo = ({todo, index, handle}) => (
  <div className="todo-item" >
    <h2>{todo.description}</h2>
    <div onClick={() => handle(index, todo.id)} >DELETE</div>
  </div>
);