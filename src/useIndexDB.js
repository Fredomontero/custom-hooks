import { useState } from 'react';
import indexedDB  from 'fake-indexeddb';

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
      console.log("TX COMPLETE: ");
      let tempData = [ ...data, {id: `data-${data.length}`, description: value} ];
      setData(tempData);
      resolve()
    }
  })

  //2) RETRIEVE FROM DB
  const getAll = () => new Promise((resolve, reject) => {
    console.log("GETALLDATA");
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
        resolve(tempData);
      }
    }

    request.onerror = (err) => {
      reject(err);
    }
  });

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

  //4) GET FROM DB
  const get = (key) => new Promise((resolve, reject) => {
    console.log("GET");
    const transaction = database.transaction(['todos'], 'readonly');
    const objectStore = transaction.objectStore('todos');
    const request = objectStore.get(key);

    request.onerror = (event) => {
      console.log(event.target.error);
      reject();
    }

    request.onsuccess = (event) => {
      resolve(request.result);
    }
  });

  const init = () => new Promise((resolve) => {
    console.log("INIT")
    const request = indexedDB.open('database', 1);
    
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
      database.getAll = getAll;
      database.get = get;
      database.remove = remove;
      // getData();
      // resolve({data, add, test});
      resolve(database);
    };
  });

  return { init, data }

};