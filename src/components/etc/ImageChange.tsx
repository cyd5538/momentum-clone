import React, { useState } from "react";
import { AiOutlineArrowDown } from "react-icons/ai";

const ImageChange = () => {
  const [background, setBackground] = useState<string>("");
  const [dropDown, setDropDown] = useState<boolean>(false)

  const handleChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    localStorage.setItem("bg", JSON.stringify(background))
    setBackground("");
    //배경 변경을 위한 새로고침 이벤트
    window.location.reload();
  }

  return (
    <div className="flex flex-col gap-2 items-center">
      <div className="flex items-center justify-center gap-2">
        <span>배경 키워드 바꾸기 </span>
        <span onClick={() => setDropDown(!dropDown)}>
          <AiOutlineArrowDown />
        </span>
      </div>
      {dropDown ? 
        <form onSubmit={handleChange} className="animate-pulse flex justify-center">
            <input
                className="w-40 pt-1 pb-1 pl-2 text-white bg-black/70 dark:bg-white dark:text-black"
                type="text"
                onChange={(e) => setBackground(e.target.value)}
            />
        </form> : null
       }
    </div>
  );
};

export default ImageChange;
