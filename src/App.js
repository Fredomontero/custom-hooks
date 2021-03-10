import './App.css';
import { Todo } from './Todo';
import { useState, useEffect, useRef } from 'react';
import { useIndexDB } from './useIndexDB';

const App = () => {

  const taskInput = useRef();
  const { data, saveIntoIndexDB, removeFromIndexDB } = useIndexDB();

  return (
    <div className="app-container">
      <h1 className="title">Custom Hooks</h1>
      <div className="input-section">
        <input type="text" ref={taskInput} placeholder="New Task..." />
        <div className="add-button" onClick={() => saveIntoIndexDB(taskInput.current.value)}>Add</div>
      </div>
      <div className="todos-container" >
        {
          (data.length <= 0) ? (<h2 className="empty-list" >There are no todos...</h2>) : 
          (
            // todos.map(todo => <h2 key={todo.id}>{ todo.description }</h2>)
            data.map(( todo, index ) => <Todo key={todo.id} todo={todo} index={index} handle={removeFromIndexDB} />)
          )
        }
      </div>
    </div>
  );
}

export default App;
