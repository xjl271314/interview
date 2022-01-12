import { useState, useEffect } from 'react';

const useSetState = (initState = '', callback = (state: any) => void 0) => {
  const [state, setState] = useState(initState);

  useEffect(() => {
    callback(state);
  }, [callback, state]);

  return [state, setState];
};

export default useSetState;
