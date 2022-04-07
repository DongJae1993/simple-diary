import React, { useState, useEffect } from "react";

const Lifecycle = () => {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const toggle = () => setIsVisible(!isVisible);

  //컴포넌트가 mount 되었을 때만 실행됨
  useEffect(() => {
    console.log("Mount");
  }, []);

  //컴포넌트가 update될 때만 실행됨
  useEffect(() => {
    console.log("Update");
  });

  //디펜더시 array에 있는 값이 변경되었을 때, 콜벡함수가 실행됨
  // 우리가 감지하고 싶은 것만 감지해서 그 값이 변화할 때 만 실행하도록 만들 수 있다.

  useEffect(() => {
    console.log(`count is update: ${count}`);
    if (count > 5) {
      alert("count가 5를 넘었습니다. 따라서 1로 초기화 합니다.");
      setCount(1);
    }
  }, [count]);

  useEffect(() => {
    console.log(`text is update: ${text}`);
  }, [text]);

  //unMount 실행
  const UnmountTest = () => {
    useEffect(() => {
      console.log("Mount!!!");
      return () => {
        //Unmount 시점에 실행되게 됨
        console.log("Unmount!");
      };
    }, []);

    return <div>Unmount testing Component</div>;
  };
  return (
    <div style={{ padding: 20 }}>
      <div>
        {count}
        <button onClick={() => setCount(count + 1)}>+</button>
      </div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <div>
        <button onClick={toggle}>On/Off</button>
        {isVisible && <UnmountTest />}
      </div>
    </div>
  );
};
