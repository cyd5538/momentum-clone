import React, { useState, useRef, useEffect } from "react";
import { BsThreeDots } from "react-icons/bs";

type Props = {
  name: String;
  setName: React.Dispatch<React.SetStateAction<string>>;
  LOCALSTORAGE_NAME: String;
};

const HomeName: React.FC<Props> = ({ name, setName, LOCALSTORAGE_NAME }) => {
  const [modal, setModal] = useState<boolean>(false);
  const modalclose = useRef<HTMLDivElement>(null);
  const [edit, setEdit] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>("");

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
    localStorage.setItem("name", JSON.stringify(editName));
    setEdit(false);
  }

  return (
    <>
      <div className="text-center ">
        <div className="text-4xl text-center mb-4 relative group flex gap-2 justify-center">
          <div>
            Hello
          </div>
          {!edit ? (
            <div className="w-1/2">
                <span>{name ? name : LOCALSTORAGE_NAME}</span>
            </div>
          ) : (
            <form onSubmit={HandleEdit} className="w-1/2">
                <input
                className="border-b-2 border-rose-600 w-full font-bold bg-transparent text-4xl pb-4 text-center outline-none"
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                />
            </form>
          )}
          <div
            onClick={() => setModal(true)}
            className="rounded-full bg-black/60 p-1  text-2xl text-center absolute hidden top-2 left-[-30px] md:left-2 text-black group-hover:block"
          >
            <BsThreeDots />
          </div>
          {modal ? (
            <div 
            ref={modalclose} 
            onClick={() => setEdit(true)}
            className="text-sm cursor-pointer hover:bg-neutral-300 hover:text-gray-500 font-semibold absolute top-6 left-[-100px] text-black bg-black/100 p-3">
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
