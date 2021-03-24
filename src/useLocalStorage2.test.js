import {renderHook, act} from '@testing-library/react-hooks'
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {

  // const { data, saveIntoLocalStorage, removeFromLocalStorage } = useLocalStorage();
  const { result } = renderHook(() => useLocalStorage());

  it('data starts as an empty array', () => {
    expect(result.current.data.length).toBe(0);
    expect(result.current.data).toEqual([]);
  });

  it.skip('saves a value into localStorage', () => {
    act(() => {
      result.current.saveIntoLocalStorage('Task 1');
    });
    expect(result.current.data.length).toBe(1);
  });

  // it.skip('saves data into local storage', () => {
  //   const result = {name: 'John'};
  //   //set json object to storage 
  //   localStorage.setItem('user', JSON.stringify(result));
  //   //get object
  //   const value = JSON.parse(localStorage.getItem('user'));
  //   console.log(value);
  //   expect(value).toEqual(result);
  //   expect
  // });
});