import { useState, useRef, useEffect } from 'react';

const useStateCallback = (initState: any = '') => {
  const isUpdate = useRef();
  const [state, setState] = useState(initState);

  const setStateCallback = (state: any, cb: any) => {
    setState((prev: any = {}) => {
      isUpdate.current = cb;
      // 如果state是方法 相当于prevState => prevState + operator
      const assignState = () => {
        // handle function
        if (state instanceof Function) {
          return state(prev);
        }
        // handle array
        if (state instanceof Array) {
          return state;
        }
        // handle object
        if (typeof state === 'object') {
          return JSON.stringify(state) == '{}' ? {} : { ...prev, ...state };
        }
        return state;
      };

      return assignState();
    });
  };

  useEffect(() => {
    if (isUpdate.current) {
      if (typeof isUpdate.current === 'function') {
        isUpdate.current(state);
      } else {
        throw new Error('setState 2 param must be a function!');
      }
    }
  }, [state]);

  return [state, setStateCallback];
};

export default useStateCallback;
