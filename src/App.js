import './App.css';
import { Todo } from './Todo';
import { useState, useEffect, useRef } from 'react';

const App = () => {

  const taskInput = useRef();
  const [ todos, setTodos ] = useState([]);

  useEffect(() => {
    console.log(window.localStorage);
    // window.localStorage.removeItem('todo-0');
    loadTodos();
  }, []);

  const saveToLocalStorage = () => {
    // console.log(taskInput.current.value);
    window.localStorage.setItem(`todo-${todos.length}`, taskInput.current.value);
    // console.log(window.localStorage);
    let tempTodos = [ ...todos, {id: `todo-${todos.length}`, description: taskInput.current.value} ];
    taskInput.current.value = "";
    setTodos(tempTodos);
  };

  const handleRemoveTodo = (index, key) => {
    window.localStorage.removeItem(key);
    let tempTodos = [...todos];
    tempTodos.splice(index, 1);
    setTodos(tempTodos);
    console.log("Local Storage: ", window.localStorage);
  }

  const loadTodos = () => {
    let tempTodos = [];
    for (const key in window.localStorage) {
      if(key.includes('todo'))
        // console.log(`${key}: ${window.localStorage[key]}`);
        tempTodos.push({
          id: key,
          description: window.localStorage[key]
        });
        setTodos(tempTodos);
    }
  };

  return (
    <div className="app-container">
      <h1 className="title">Custom Hooks</h1>
      <div className="input-section">
        <input type="text" ref={taskInput} placeholder="New Task..." />
        <div className="add-button" onClick={saveToLocalStorage}>Add</div>
      </div>
      <div className="todos-container" >
        {
          (todos.length <= 0) ? (<h2 className="empty-list" >There are no todos...</h2>) : 
          (
            // todos.map(todo => <h2 key={todo.id}>{ todo.description }</h2>)
            todos.map(( todo, index ) => <Todo key={todo.id} todo={todo} index={index} handle={handleRemoveTodo} />)
          )
        }
      </div>
    </div>
  );
}

export default App;
