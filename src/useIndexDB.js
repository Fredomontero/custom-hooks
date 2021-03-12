import { useState, useEffect } from 'react';

export const useIndexDB = () => {

  const [ data, setData ] = useState([]);
  let database, objectStore;

  const initDB = () => {
    return new Promise((resolve) => {
      console.log("Inside initDB")
      const request = window.indexedDB.open('database', 1);
      
      request.onerror = () => console.error("ERROR", request.error);
      
      request.onupgradeneeded = (event) => {
        console.log("CREATE");
        database = request.result;
        console.log("DB: ", database);
        objectStore = database.createObjectStore("todos", {keyPath: "id"});
      };
      
      request.onsuccess = () => {
        console.log("OPEN");
        database = request.result;
        console.log("DB inside onSuccess: ", database);
        resolve(database);
      };
    });
  };

  useEffect(() => {
    initDB()
    .then(async db => {
      console.log("Database inside useEffect :", db);
      // loadData();
    })
  }, []);

  //1) SAVE INTO DB
  const saveIntoIndexDB = (value) => {
    console.log("SAVE INTO INDEX");
    console.log("DB: ", database);
    const transaction = database.transaction(['todos'], 'readwrite');
    const objectStore = transaction.objectStore('todos');
    let todo = { id:  `data-${data.length}`, description: value };
    const request = objectStore.add(todo);
    // window.sessionStorage.setItem(`data-${data.length}`, value);
    let tempData = [ ...data, {id: `data-${data.length}`, description: value} ];
    setData(tempData);
  };

  //2) DELETE FROM DB
  const removeFromIndexDB = (index, key) => {
    window.sessionStorage.removeItem(key);
    let tempData = [...data];
    tempData.splice(index, 1);
    setData(tempData);
    console.log("Session Storage: ", window.sessionStorage);
  }

  //3) RETRIEVE FROM DB
  const loadData = () => {
    console.log("LOADING DATA");
    console.log("DB: ", database);
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
    // let tempData = [];
    // for (const key in window.sessionStorage) {
    //   if(key.includes('data'))
    //     // console.log(`${key}: ${window.localStorage[key]}`);
    
    // }
  };

  return {
    data,
    saveIntoIndexDB,
    removeFromIndexDB
  }

};