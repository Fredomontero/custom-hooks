import { useState } from 'react';

export const useIndexDB = () => {

  const [ data, setData ] = useState([]);
  let database, objectStore;

  //1) SAVE INTO DB
  const add = (value) => new Promise((resolve, reject) => {
    console.log("ADD");
    const transaction = database.transaction(['todos'], 'readwrite');
    const objectStore = transaction.objectStore('todos');
    let todo = { id:  `data-${data.length}`, description: value };
    const request = objectStore.add(todo);

    transaction.onerror = (err) => {
      console.log("TX ERROR: ", err);
      reject(err)
    }

    transaction.oncomplete = (e) => {
      console.log("TX COMPLETE: ", e);
      let tempData = [ ...data, {id: `data-${data.length}`, description: value} ];
      setData(tempData);
      resolve(true)
    }
  })

  //2) RETRIEVE FROM DB
  const getData = () => {
    console.log("GETDATA");
    let tempData = [];
    const transaction = database.transaction(['todos'], 'readonly');
    const objectStore = transaction.objectStore('todos');
    const request = objectStore.openCursor();

    request.onsuccess = (e) => {
      const cursor = e.target.result;
      if(cursor){
        console.log(cursor.value);
        tempData.push({
          id: cursor.value.id,
          description: cursor.value.description
        });
        cursor.continue();
      }else{
        console.log("No more data");
        setData(tempData);
      }
    }
  };

  //3) REMOVE FROM DB
  const remove = (key) => new Promise((resolve, reject) => {
    console.log("REMOVE");
    const transaction = database.transaction(['todos'], 'readwrite');
    const objectStore = transaction.objectStore('todos');
    const request = objectStore.delete(key);

    transaction.onerror = (err) => {
      console.log("TX ERROR: ", err);
      reject(err)
    }

    transaction.oncomplete = (e) => {
      console.log("TX COMPLETE: ", e);
      resolve();
    }
  });

  const init = () => new Promise((resolve) => {
    console.log("INIT")
    const request = window.indexedDB.open('database', 1);
    
    request.onerror = () => console.error("ERROR", request.error);
    
    request.onupgradeneeded = (event) => {
      console.log("CREATE");
      database = event.target.result;
      objectStore = database.createObjectStore("todos", {keyPath: "description"});
    };
    
    request.onsuccess = (event) => {
      console.log("OPEN");
      database = event.target.result;
      database.add = add;
      database.getData = getData;
      database.remove = remove;
      // getData();
      // resolve({data, add, test});
      resolve(database);
    };
  });

  return { init, data }

};