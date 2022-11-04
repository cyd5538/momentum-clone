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
      <div className="text-3xl flex flex-col gap-2">
        {hometodo?.length !== 1 ? (
          <>
            <div>What is your main focus for today?</div>
            <form onSubmit={handleHomeTodo}>
              <input
                ref={inputFocus}
                value={todo}
                onChange={(e) => todos(e.target.value)}
                className="bg-transparent border-b-2 border-b-black"
                type="text"
              />
            </form>
          </>
        ) : (
          <div className="w-full text-center mt-4">
            <div className="mb-4">Today</div>
            <div className="group relative gap-2 w-96 m-auto">
              <div className="hidden  z-10 group-hover:block hover:block absolute top-5 left-[80px]" onClick={() => checktodo(hometodo[0].id)}>{hometodo[0]?.isBoolean ? <BsCheckSquareFill className="pt-1" size={25} /> : <BsCheckSquare className="pt-1" size={25} />}</div>
              {hometodo[0].isBoolean ? <s className="relative  top-4">{hometodo[0]?.todo}</s> : <div className="relative top-4">{hometodo[0]?.todo}</div>}
              <div onClick={() => setModal(true)} className="hidden z-10 group-hover:block hover:block absolute top-5 right-[80px]">
                <div><BsThreeDots /></div>
                {modal ? 
                <>
                  <div ref={modalclose} className="absolute text-sm bg-white">
                    <div onClick={handleEdit} className="font-light cursor-pointer hover:bg-slate-300 pl-2 pr-2 pb-1 pt-1">edit</div>
                    <div onClick={handleClear} className="font-light cursor-pointer hover:bg-slate-300 pl-2 pr-2 pb-1 pt-1">clear</div>
                  </div>
                </>:<></>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeTodo;
