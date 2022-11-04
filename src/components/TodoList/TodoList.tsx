import React, { useState,useEffect } from "react";
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


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text) {
      const newTask = { id: Date.now(), text, isBoolean: false }
      setTextList([...textlist, newTask]);
      localStorage.setItem("localTasks", JSON.stringify([...textlist, newTask]));
      setText("");
    }
  };

  useEffect(()=>{
    if(localStorage.getItem("localTasks")){
        const storedList = JSON.parse(localStorage.getItem("localTasks"));
        setTextList(storedList);
    }
  },[])

  const ModalToggle = () => {
    if(modal === true){
      localStorage.setItem("todoModal", JSON.stringify(false));
      setModal(false)
    }else{
      localStorage.setItem("todoModal", JSON.stringify(true));
      setModal(true)
    }
  }

  useEffect(() => {
    if(localStorage.getItem("todoModal")){
      const modal = JSON.parse(localStorage.getItem("todoModal"));
      setModal(modal);
    }
  },[])

  return (
    <div>
      <div
        className="cursor-pointer   text-black font-bold fixed bottom-6 right-4"
        onClick={ModalToggle}
      >
        Todo
      </div>
      {modal ? (
        <div
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
