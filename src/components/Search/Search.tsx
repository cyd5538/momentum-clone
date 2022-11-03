import React, { useState, useRef, useEffect } from "react";
import { BsSearch } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";

const Search = () => {
  const SEARCH_LOCAL = JSON.parse(localStorage.getItem("search"));
  const [text, setText] = useState<string>("");
  const [modal, setModal] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>(`${SEARCH_LOCAL ? SEARCH_LOCAL : "google"}`);
  const modalclose = useRef<HTMLDivElement>(null);

  const handler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(selected === 'google'){
        if (text) {
            window.location.href = `https://www.google.com/search?q=${text}`;
        }
    }
    if(selected === 'naver'){
        if (text) {
            window.location.href = `https://search.naver.com/search.naver?query=${text}`;
        }
    }
    localStorage.setItem("search", JSON.stringify(selected));
  };

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

  const handleSelected = async(value: string) => {
    await setModal(false)
    setSelected(value);
  };

  return (
    <div className="fixed top-2 left-2 text-black flex items-center">
      <div className="mr-2">Links</div>
      <form className="flex items-center" onSubmit={handler}>
        <span className="mr-2">
          <BsSearch />
        </span>
        <input
          className="pb-2 bg-transparent border-b-2 border-black"
          type="text"
          onChange={(e) => setText(e.target.value)}
        />
        <div className="">
            <div className="cursor-pointer" onClick={() => setModal(true)}>
            {selected === "google" ? (
                <span className="w-6 flex justify-center ">
                <FcGoogle />
                </span>
            ) : (
                <span className="w-6 flex justify-center bold text-lime-500">
                N
                </span>
            )}
        </div>
        {modal ? (
          <div
            ref={modalclose}
            className="flex drop-shadow-2xl bg-white rounded absolute top-8 flex-col right-[-86px]"
          >
            <div className="pl-2 pr-2 text-xs text-gray-500">SEARCH WITH</div>
            <div
              onClick={() => handleSelected("google")}
              className="gap-1 p-2 cursor-pointer flex items-center hover:bg-gray-100"
            >
              <span className="w-6 flex justify-center ">
                <FcGoogle />
              </span>{" "}
              Google
            </div>
            <div
              onClick={() => handleSelected("naver")}
              className="gap-1 p-2 cursor-pointer flex items-center hover:bg-gray-100"
            >
              <span className="w-6 flex justify-center bold text-lime-500">
                N
              </span>{" "}
              Naver
            </div>
          </div>
        ) : null}
      </div>
      </form>

    </div>
  );
};

export default Search;
