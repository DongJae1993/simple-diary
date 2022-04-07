import React, {
  useCallback,
  useMemo,
  useEffect,
  useRef,
  useReducer,
} from "react";

import "./App.css";
import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";

//(상태변화가 일어나기 직전의 state, 어떤 상태변화를 일으켜야 하는지에 대한 정보들이 담겨있는 action)
const reducer = (state, action) => {
  switch (action.type) {
    case "INIT": {
      return action.data;
    }
    case "CREATE": {
      const created_date = new Date().getTime();
      const newItem = {
        ...action.data,
        created_date,
      };
      return [newItem, ...state];
    }
    case "REMOVE": {
      return state.filter((it) => it.id !== action.targetId);
    }
    case "EDIT": {
      return state.map((it) =>
        it.id === action.targetId ? { ...it, content: action.newContent } : it
      );
    }
    default:
      return state;
  }
};

export const DiaryStateContext = React.createContext();
export const DiaryDispatchContext = React.createContext();

function App() {
  // const [data, setData] = useState([]);

  const [data, dispatch] = useReducer(reducer, []); // useState이 아닌 useReducer를 사용하는 이유는 복잡한 상태변화 로직을 컴포넌트 밖으로 분리하기 위해서

  const dataId = useRef(0);

  const getData = async () => {
    const res = await fetch(
      "https://jsonplaceholder.typicode.com/comments"
    ).then((res) => res.json());

    //data에서 0-20까지만 사용(res: 받아온 함수)
    const initData = res.slice(0, 20).map((it) => {
      return {
        author: it.email,
        content: it.body,
        emotion: Math.floor(Math.random() * 5) + 1,
        created_date: new Date().getTime(),
        id: dataId.current++,
      };
    });
    // setData(initData);
    dispatch({ type: "INIT", data: initData });
  };

  // 컴포넌트가 mount 되는 시점에 API를 호출함
  useEffect(() => {
    getData();
  }, []);

  const onCreate = useCallback((author, content, emotion) => {
    dispatch({
      type: "CREATE",
      data: { author, content, emotion, id: dataId.current },
    });

    // const created_date = new Date().getTime();
    // const newItem = {
    //   author,
    //   emotion,
    //   content,
    //   created_date,
    //   id: dataId.current,
    // };
    dataId.current += 1;
    // setData((data) => [newItem, ...data]); // setState함수(상태변화 함수)에다가 함수를 전달 : 함수형 업데이트
  }, []);

  const onRemove = useCallback((targetId) => {
    dispatch({ type: "REMOVE", targetId });

    // setData((data) => data.filter((it) => it.id !== targetId)); //filter : 조건에 맞는 배열만을 가지고 새로운 배열을 만듬
  }, []);

  const onEdit = useCallback((targetId, newContent) => {
    dispatch({ type: "EDIT", targetId, newContent });

    //   setData((data) =>
    //     data.map((it) =>
    //       it.id === targetId ? { ...it, content: newContent } : it
    //     )
    // );
  }, []);

  const memoizedDispatches = useMemo(() => {
    return { onCreate, onRemove, onEdit };
  }, []);

  const getDiaryAnalysis = useMemo(() => {
    const goodCount = data.filter((it) => it.emotion >= 3).length;
    const badCount = data.length - goodCount;
    const goodRatio = (goodCount / data.length) * 100;
    return { goodCount, badCount, goodRatio };
  }, [data.length]);

  const { goodCount, badCount, goodRatio } = getDiaryAnalysis; //Memo를 사용하면 함수가 아니게 된다. 값을 return 받게 된다. 그래서 값으로 사용해야 한다.

  return (
    <DiaryStateContext.Provider value={data}>
      <DiaryDispatchContext.Provider value={memoizedDispatches}>
        <div className="App">
          <DiaryEditor />
          <div>전체 일기 : {data.length} </div>
          <div>기분 좋은 일기의 개수 : {goodCount}</div>
          <div>기분 나쁜 일기의 개수 : {badCount}</div>
          <div>기분 좋은 일기의 비율 : {goodRatio}</div>
          <DiaryList />
        </div>
      </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider>
  );
}

export default App; // 파일 하나 당 하나만 쓸 수 있다.
