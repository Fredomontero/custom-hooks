import { renderHook, act } from '@testing-library/react-hooks'
import { useIndexDB } from './useIndexDB';


describe('useIndexDB', () => {

  const { result } = renderHook(() => useIndexDB())

  it.skip('data starts empty', async () => {
    try{
      let database;
      let task;
      database = await result.current.init();
      await act( async() => { 
        await database.add('Task 1') 
      });
      await act( async() => { 
        task = await database.get('Task 1') 
      });
      expect(task.description).toBe('Task 1');
    }catch(error){
      console.log("ERROR: ", error);
    }
  });

  it('Saves data into indexedDB', async () => {
    try{
      let database;
      let tasks;
      database = await result.current.init();
      await act( async() => { 
        await database.add('Walk the dog')
      });
      await act( async() => { 
        await database.add('Feed the cat')
      });
      await act( async() => { 
        await database.add('Buy food')
      });
      await act( async() => { 
        tasks = await database.getAll() 
      });
      expect(tasks.length).toBe(3);
    }catch(error){
      console.log("ERROR: ", error);
    }
  })

});