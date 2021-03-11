import { useState, useEffect } from 'react';

export const useIndexDB = () => {

  const [ data, setData ] = useState([]);
  let database, objectStore;

  const initDB = async () => {

    console.log("Inside initDB")
    const request = await window.indexedDB.open('database', 1);

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
      loadData();
    };

    return database;
    
  };

  useEffect(() => {
    initDB();
    console.log("DB inside UseEffect: ", database);
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
    // let tempData = [ ...data, {id: `data-${data.length}`, description: value} ];
    // setData(tempData);
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
    console.log("Loading data");
    let tempData = [];
    for (const key in window.sessionStorage) {
      if(key.includes('data'))
        // console.log(`${key}: ${window.localStorage[key]}`);
        tempData.push({
          id: key,
          description: window.sessionStorage[key]
        });
        setData(tempData);
    }
  };

  return {
    data,
    saveIntoIndexDB,
    removeFromIndexDB
  }

};