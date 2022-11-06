import React, { useState, useRef, useEffect } from "react";
import { BsThreeDots } from "react-icons/bs";

type Props = {
  name: String;
  setName: React.Dispatch<React.SetStateAction<string>>;
};

const HomeName: React.FC<Props> = ({ name, setName,  }) => {
  const [modal, setModal] = useState<boolean>(false);
  const modalclose = useRef<HTMLDivElement>(null);
  const [edit, setEdit] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>();

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

  const HandleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setName(editName);
    if(editName === ""){
      return alert("이름을 입력해주세요")
    }
    localStorage.setItem("name", JSON.stringify(editName));
    setEdit(false);
  }

  const handleEditMove = async () => {
    await setModal(false);
    await setEdit(true)
    if(inputRef.current !== undefined && inputRef.current !== null){
      inputRef.current.focus()
    }
  }

  return (
    <>
      <div className="text-center ">
        <div className="text-3xl text-black dark:text-white/80 text-center mb-4 relative group gap-2 flex justify-center">
          <div>
            Hello
          </div>
          {!edit ? (
            <div className="w-auto flex-initial">
                <span>{name}</span>
            </div>
          ) : (
            <form onSubmit={HandleEdit} className="w-1/2 flex-initial">
                <input
                ref={inputRef}
                className="border-b-2 border-rose-600 w-full font-bold bg-transparent text-3xl pb-4 text-center outline-none"
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                />
            </form>
          )}
          <div
            onClick={() => setModal(true)}
            className="rounded-full bg-white/60 p-1 dark:bg-black/60 dark:text-white   text-2xl text-center absolute hidden top-1 left-[-30px] md:left-2 text-black group-hover:block"
          >
            <BsThreeDots />
          </div>
          {modal ? (
            <div 
            ref={modalclose} 
            onClick={handleEditMove}
            className="dark:bg-black/80 dark:text-white text-sm cursor-pointer hover:bg-neutral-300 hover:text-gray-500 font-semibold absolute top-6 left-[-100px] text-black bg-white/100 p-3">
              Edit your Name
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
};

export default HomeName;
