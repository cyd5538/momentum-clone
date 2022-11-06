import React, { useState, useEffect, useRef } from "react";
import { BsCheckSquareFill, BsCheckSquare, BsThreeDots } from "react-icons/bs";

interface HomeTodo {
  todo: string;
  id: number
  isBoolean: boolean;
}

const HomeTodo = () => {
  const [todo, todos] = useState<string>("");
  const [hometodo, setHometodo] = useState<HomeTodo[]>([]);
  const [modal, setModal] = useState<boolean>(false);
  const modalclose = useRef<HTMLDivElement>(null);
  const inputFocus = useRef<HTMLInputElement>(null);

  const handleHomeTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (todo) {
      const newTodo = { id: Date.now(), todo, isBoolean: false }
      setHometodo([...hometodo, newTodo]);
      localStorage.setItem("hometodo", JSON.stringify([...hometodo, newTodo]));
    }
  };

  const checktodo = (id:number) => {
    const editedTodo =  hometodo.map((todo) =>
      todo.id === id ? { ...todo, isBoolean: !todo.isBoolean } : todo
    )
    setHometodo(editedTodo);
    localStorage.setItem("hometodo", JSON.stringify(editedTodo))
  }

  const handleEdit = async() => {
    await localStorage.removeItem("hometodo")
    await setModal(false)
    await setHometodo([])
    inputFocus.current.focus()
  }

  const handleClear = async() => {
    await localStorage.removeItem("hometodo")
    await setModal(false)
    await setHometodo([])
    inputFocus.current.focus()
  }


  useEffect(() => {
    if(localStorage.getItem("hometodo")){
      const todo = JSON.parse(localStorage.getItem("hometodo"));
      setHometodo(todo);
    }
  },[])

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


  return (
    <div>
      <div className="text-2xl text-black dark:text-white/80 flex flex-col gap-2">
        {hometodo?.length !== 1 ? (
          <>
            <div>What is your main focus for today?</div>
            <form onSubmit={handleHomeTodo} className="flex pt-4 justify-center">
              <input
                ref={inputFocus}
                value={todo}
                onChange={(e) => todos(e.target.value)}
                className="bg-transparent border-b-2 border-b-black "
                type="text"
              />
            </form>
          </>
        ) : (
          <div className="w-full text-center mt-4">
            <div className="mb-4">Today</div>
            <div className="flex justify-center w-full m-auto">
              <div className="group flex justify-space items-center gap-4 ">
                <div className=" hidden  z-10 group-hover:block hover:block " onClick={() => checktodo(hometodo[0].id)}>{hometodo[0]?.isBoolean ? <BsCheckSquareFill className="pt-1" size={25} /> : <BsCheckSquare className="pt-1" size={25} />}</div>
                {hometodo[0].isBoolean ? <s className="">{hometodo[0]?.todo}</s> : <div className="">{hometodo[0]?.todo}</div>}
                <div onClick={() => setModal(true)} className=" hidden z-10 group-hover:block hover:block ">
                  <div><BsThreeDots /></div>
                  {modal ? 
                  <>
                    <div ref={modalclose} className="absolute text-sm bg-gray-500">
                      <div onClick={handleEdit} className="font-light cursor-pointer dark:bg-black dark:text-white hover:bg-slate-600 pl-2 pr-2 pb-1 pt-1">edit</div>
                      <div onClick={handleClear} className="font-light cursor-pointer dark:bg-black dark:text-white hover:bg-slate-600 pl-2 pr-2 pb-1 pt-1">clear</div>
                    </div>
                  </>:<></>}
                </div>
              </div>
          </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeTodo;
