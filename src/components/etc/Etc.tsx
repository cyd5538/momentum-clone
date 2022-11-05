import React, { useState, useEffect, useRef } from "react";
import { BsFillSunFill,BsFillMoonFill } from "react-icons/bs";

const Etc = () => {
  const [theme, setTheme] = useState<string>("light");
  const [modal, setModal] = useState<boolean>(false);
  const modalclose = useRef<HTMLDivElement>(null);
  const element = document.documentElement;

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


  useEffect(() => {
    switch (theme) {
      case "dark":
        element.classList.add("dark");
        break;
      case "light":
        element.classList.remove("dark");
        break;
      default:
        break;
    }
  }, [theme]);

  useEffect(() => {
    if(localStorage.getItem("theme")){
        const theme = JSON.parse(localStorage.getItem("theme"));
        setTheme(theme);
    }
  },[])

  return (
    <div className="text-white dark:text-black font-bold fixed bottom-4 left-2">
        {modal ? 
        <div className="bg-white text-black dark:bg-black/80 dark:text-white pl-12 pr-12 pt-2 pb-2" ref={modalclose}>

            <div>기타</div>
            <label className="inline-flex relative items-center cursor-pointer">
            <input type="checkbox" checked={theme === "light" ? true : false} className="sr-only peer"/>
            <div className="text-black flex justify-around items-center w-11 h-6 bg-gray-200  peer-focus:outline-none peer-focus:ring-4 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ">
                <div className="flex w-full justify-around items-center">
                    <div onClick={() => {
                        setTheme('dark')
                        localStorage.setItem("theme", JSON.stringify("dark"));
                    }}><BsFillMoonFill /></div>
                    <div onClick={() => {
                        setTheme('light')
                        localStorage.setItem("theme", JSON.stringify("light"));
                    }}><BsFillSunFill /></div>
                </div>
            </div>  
            </label>
        </div> : null}
        <div onClick={() => setModal(true)}>ETC</div>
    </div>
  );
};

export default Etc;
