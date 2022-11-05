import React, { useState, useRef, useEffect } from "react";
import { BsThreeDots } from "react-icons/bs";
import { AiFillCheckCircle, AiOutlineCheckCircle } from "react-icons/ai";

interface textlist {
  text: string;
  id: number;
  isBoolean: boolean;
}

type Props = {
  text: string;
  id: number;
  isBoolean: boolean;
  setTextList: React.Dispatch<React.SetStateAction<textlist[]>>;
  textlist: textlist[];
};

const TodoItem: React.FC<Props> = ({
  text,
  id,
  setTextList,
  isBoolean,
  textlist,
}) => {
  const [editTodo, setEditTodo] = useState<string>(text);
  const [edit, setEdit] = useState<boolean>(true);
  const [modal, setModal] = useState<boolean>(false);
  const modalclose = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  
  const handleDelete = (id: number) => {
    const deleted = textlist.filter((text) => text.id !== id)
    setTextList(deleted);
    localStorage.setItem("localTasks", JSON.stringify(deleted))
  };

  const handleEdit = (e: React.FormEvent, id: number) => {
    e.preventDefault();
    const editedTodo =  textlist.map((text) =>
      text.id === id ? { ...text, text: editTodo } : text
    )
    setTextList(editedTodo);
    localStorage.setItem("localTasks", JSON.stringify(editedTodo))
    setEdit(true);
  };

  const handleEditMove = async () => {
    await setEdit(false);
    if (inputRef.current !== undefined && inputRef.current !== null) {
      inputRef.current.focus();
    }
    await setModal(false);
  };

  const handleDone = (id: number) => {
    const editedTodo =  textlist.map((text) =>
       text.id === id ? { ...text, isBoolean: !text.isBoolean } : text
    )
    setTextList(editedTodo);
    localStorage.setItem("localTasks", JSON.stringify(editedTodo))
  };


  return (
    <div className="w-full flex items-center gap-2 mb-2">
      <div className="flex items-center" onClick={() => handleDone(id)}>
        {isBoolean ? <AiFillCheckCircle /> : <AiOutlineCheckCircle />}
      </div>
      {edit ? (
        <div className="flex-initial w-36">
          {isBoolean ? <s>{text}</s> : <span>{text}</span>}
        </div>
      ) : (
        <form
          className="flex-initial bg-slate-200 w-36"
          onSubmit={(e) => handleEdit(e, id)}
        >
          <input
            ref={inputRef}
            value={editTodo}
            onChange={(e) => setEditTodo(e.target.value)}
            className="bg-white text-black dark:bg-black/90 dark:text-white"
          />
        </form>
      )}
      <div className="relative" onClick={() => setModal(true)}>
        <div>
          <BsThreeDots />
        </div>
        {modal ? (
          <div ref={modalclose} className="absolute bg-gray-100  dark:bg-black right-4">
            <div>
              <div
                onClick={(e) => handleDelete(id)}
                className="cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-900 pl-6 pr-6 pt-1 pb-1"
              >
                Delete
              </div>
            </div>
            <div>
              <div
                onClick={handleEditMove}
                className="cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-900 pl-6 pr-6 pt-1 pb-1"
              >
                Edit
              </div>
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default TodoItem;
