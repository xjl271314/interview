import React from 'react';
import { Button, Space } from 'antd';
import { useStateCallback } from 'interview';

export default () => {
  const [arr, setArr] = useStateCallback([]);
  const [obj, setObj] = useStateCallback({});
  const [state, setState] = useStateCallback({});
  const [date, setDate] = useStateCallback(new Date());
  const [symbol, setSymbol] = useStateCallback(Symbol('11'));
  const [map, setMap] = useStateCallback(new Map());

  console.log('arr', arr, 'obj', obj, 'state', state);

  const handleArr = (arr) => {
    setArr(arr);
  };

  const handleObj = (obj) => {
    setObj(obj);
  };

  return (
    <Space>
      <Button onClick={() => handleArr([])}>点我更改数组数据为[]</Button>
      <Button onClick={() => handleArr([1, 2, 3])}>
        点我更改数组数据为[1,2,3]
      </Button>
      <Button onClick={() => handleObj({})}>点我更改对象数据为`{}`</Button>
      <Button onClick={() => handleObj({ a: 1, b: 2 })}>
        点我更改对象数据为{`a:1, b: 2`}
      </Button>
      <Button onClick={() => handleObj({ a: 3 })}>点我更改对象数据a为3</Button>
      <Button onClick={() => handleObj({ c: 4 })}>点我追加数据c为4</Button>
    </Space>
  );
};
