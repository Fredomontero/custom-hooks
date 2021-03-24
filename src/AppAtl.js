import './App.css';
import { Todo } from './Todo';
import { useRef, useEffect } from 'react';
import { useIndexDB } from './useIndexDB';

const App = () => {

  const taskInput = useRef();
  const { data, init } = useIndexDB();

  useEffect(() => {
    init().then(database => database.loadData());
  }, [])

  const save = (value) => init().then((database) => {
    database.add(value)
  });

  return (
    <div className="app-container">
      <h1 className="title">Custom Hooks</h1>
      <div className="input-section">
        <input type="text" ref={taskInput} placeholder="New Task..." />
        {/* <div className="add-button" onClick={() => saveIntoIndexDB(taskInput.current.value)}>Add</div> */}
        <div className="add-button" onClick={() => save(taskInput.current.value)}>Add</div>
      </div>
      <div className="todos-container" >
        {
          (data.length <= 0) ? (<h2 className="empty-list" >There are no todos...</h2>) : 
          (
            // data.map(( todo, index ) => <Todo key={todo.id} todo={todo} index={index} handle={removeFromIndexDB} />)
            data.map(( todo, index ) => <Todo key={todo.id} todo={todo} index={index} handle={console.log("Hola mundo")} />)
          )
        }
      </div>
    </div>
  );
}

export default App;
