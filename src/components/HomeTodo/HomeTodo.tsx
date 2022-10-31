import React, { useState, useRef, useEffect } from "react";
import { BsThreeDots } from "react-icons/bs";
import { GrClear } from "react-icons/gr";
import { AiOutlineEdit } from "react-icons/ai";

interface Todo {
  todo: string;
  isDone: boolean;
}

const HomeTodo = () => {
  const [todo, setTodo] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoComplete, setTodoComplete] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);
  const modalclose = useRef<HTMLDivElement>(null);

  const handleHomeTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (todo) {
      setTodos([...todos, { todo, isDone: false }]);
      localStorage.setItem("hometodo", JSON.stringify({ todo, isDone: true }));
    }
  };

  const LOCALSTORAGE_HOMETODO = JSON.parse(localStorage.getItem("hometodo"));
  
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

  const handleDelete = () => {
    localStorage.removeItem("hometodo");
    setTodos([]);
  }
  const handleClear = () => {
    localStorage.removeItem("hometodo");
    setTodos([]);
    setTodo("");
  }


  return (
    <>
      {LOCALSTORAGE_HOMETODO?.todo ? (
        <div className="pt-6">
          <div className="text-center text-3xl mb-4">Today</div>
          <div className="text-center text-2xl flex justify-center gap-4 items-center">
            <div>
              <input
                className="w-5 h-5"
                type="checkbox"
                checked={todoComplete}
                onChange={() => setTodoComplete(!todoComplete)}
              />
            </div>
            {todoComplete ? (
              <s>{LOCALSTORAGE_HOMETODO.todo}</s>
            ) : (
              <div>{LOCALSTORAGE_HOMETODO.todo}</div>
            )}
            <div className="relative">
              <div onClick={() => setModal(true)}><BsThreeDots /></div>
              {modal ? 
                <div ref={modalclose} className="font-light w-36 h-16  absolute top-6 right-[-120px] bg-white text-sm text-black flex-row items-center justify-center">
                  <div onClick={handleDelete} className="w-36 h-8 flex items-center justify-start p-2 gap-2 hover:bg-slate-200 cursor-pointer">
                    <AiOutlineEdit /><span>Edit</span>
                  </div>
                  <div onClick={handleClear} className="w-36 h-8 flex items-center justify-start p-2 gap-2 hover:bg-slate-200 cursor-pointer">
                    <GrClear /> <span>Clear</span>
                  </div>
               </div>
              :
              null
              }
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="text-center text-3xl">
            What is your main focus for today?
          </div>
          <form onSubmit={handleHomeTodo}>
            <input
              value={todo}
              onChange={(e) => setTodo(e.target.value)}
              type="text"
              className="border-b-2 font-boldf w-full bg-transparent text-2xl pb-2 text-center outline-none"
            />
          </form>
        </>
      )}
    </>
  );
};

export default HomeTodo;
