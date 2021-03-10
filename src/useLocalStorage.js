import { useState, useEffect } from 'react';

export const useLocalStorage = () => {

  const [ data, setData ] = useState([]);

  useEffect(() => {
    console.log(window.localStorage);
    loadData();
  }, []);

  const saveIntoLocalStorage = (value) => {
    // console.log(taskInput.current.value);
    window.localStorage.setItem(`data-${data.length}`, value);
    // console.log(window.localStorage);
    let tempData = [ ...data, {id: `data-${data.length}`, description: value} ];
    // taskInput.current.value = "";
    setData(tempData);
  };

  const removeFromLocalStorage = (index, key) => {
    window.localStorage.removeItem(key);
    let tempData = [...data];
    tempData.splice(index, 1);
    setData(tempData);
    console.log("Local Storage: ", window.localStorage);
  }

  const loadData = () => {
    let tempData = [];
    for (const key in window.localStorage) {
      if(key.includes('data'))
        // console.log(`${key}: ${window.localStorage[key]}`);
        tempData.push({
          id: key,
          description: window.localStorage[key]
        });
        setData(tempData);
    }
  };

  return {
    data,
    saveIntoLocalStorage,
    removeFromLocalStorage
  }

};