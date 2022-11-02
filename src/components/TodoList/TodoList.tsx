import React, { useState, useRef, useEffect } from "react";
import TodoItem from "./TodoItem";

interface textlist {
  text: string;
  id: number;
  isBoolean: boolean;
}

const TodoList = () => {
  const [text, setText] = useState<string>("");
  const [textlist, setTextList] = useState<textlist[]>([]);
  const [modal, setModal] = useState<boolean>(false);
  const modalclose = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickOutside = (e: any) => {
      if (modal && !modalclose.current?.contains(e.target)) {
        setModal(false);
      }
    };
    document.addEventListener("mousedown", clickOutside);
    return () => {
      document.removeEventListener("mousedown", clickOutside);
    };
  }, [modal]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text) {
      setTextList([...textlist, { id: Date.now(), text, isBoolean: false }]);
      setText("");
    }
  };
  console.log(textlist)
  return (
    <div>
      <div
        className="text-black font-bold fixed bottom-6 right-4"
        onClick={() => setModal(true)}
      >
        Todo
      </div>
      {modal ? (
        <div
          ref={modalclose}
          className="absolute bottom-12 right-4 w-60 h-auto p-4 bg-white "
        >
          <div className="text-black">
            {textlist.map((text) => (
              <TodoItem
                key={text.id}
                text={text.text}
                isBoolean={text.isBoolean}
                setTextList={setTextList}
                textlist={textlist}
                id={text.id}
              />
            ))}
          </div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full text-black"
              placeholder="New Todo"
            />
          </form>
        </div>
      ) : null}
    </div>
  );
};

export default TodoList;
