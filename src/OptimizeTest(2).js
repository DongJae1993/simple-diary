import React, { useState, useEffect } from "react";

const CounterA = React.memo(({ count }) => {
  console.log(`CounterA Update - count : ${count}`);
  return <div>{count}</div>;
});

//JS는 객체를 비교할때는 얕은 비교를 하기 때문에 계속 리렌더링이 된다.
const CounterB = ({ obj }) => {
  console.log(`CounterB Update - count : ${obj.count}`);
  return <div>{obj.count}</div>;
};

const areEqual = (prevProps, nextProps) => {
  if (prevProps.obj.count === nextProps.obj.count) {
    return true;
  }
  return false;
};

const MemoizedCounterB = React.memo(CounterB, areEqual);

const OptimizeTest = () => {
  const [count, setCount] = useState(1);
  const [obj, setObj] = useState({
    count: 1,
  });

  return (
    <div style={{ padding: 50 }}>
      <div>
        <h2>Counter A</h2>
        <CounterA count={count} />
        <button onClick={() => setCount(count)}>A button</button>
      </div>
      <div>
        <h2>Counter B</h2>
        <MemoizedCounterB obj={obj} />
        <button
          onClick={() =>
            setObj({
              count: obj.count,
            })
          }
        >
          B button
        </button>
      </div>
    </div>
  );
};

export default OptimizeTest;
