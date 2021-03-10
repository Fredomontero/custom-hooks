import { useState, useEffect } from 'react';

export const useSessionStorage = () => {

  const [ data, setData ] = useState([]);

  useEffect(() => {
    console.log(window.sessionStorage);
    loadData();
  }, []);

  const saveIntoSessionStorage = (value) => {
    // console.log(taskInput.current.value);
    window.sessionStorage.setItem(`data-${data.length}`, value);
    // console.log(window.localStorage);
    let tempData = [ ...data, {id: `data-${data.length}`, description: value} ];
    // taskInput.current.value = "";
    setData(tempData);
  };

  const removeFromSessionStorage = (index, key) => {
    window.sessionStorage.removeItem(key);
    let tempData = [...data];
    tempData.splice(index, 1);
    setData(tempData);
    console.log("Session Storage: ", window.sessionStorage);
  }

  const loadData = () => {
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
    saveIntoSessionStorage,
    removeFromSessionStorage
  }

};