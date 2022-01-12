import { useState, useEffect } from 'react';

const useStatePromise = (initState: any = '') => {
  const [state, setState] = useState({
    value: initState,
    resolve: (value: any) => {},
  });

  const setStatePromise = (updater: any) => {
    return new Promise((resolve) => {
      setState((prevState: any) => {
        let nextVal = updater;
        if (updater instanceof Function) {
          nextVal = updater(prevState.value);
        }

        return {
          value:
            JSON.stringify(updater) == '{}' ? {} : { ...initState, ...nextVal },
          resolve,
        };
      });
    });
  };

  useEffect(() => {
    state.resolve(state.value);
  }, [state]);

  return [
    state.value,
    (updater: (value: any) => any) => {
      return setStatePromise(updater);
    },
  ];
};

export default useStatePromise;
