import React, { useEffect, useState, useRef } from "react";
import useGeoLocation from "../../Hooks/useGeoLocation";
import axios from "axios";
import { TbTemperatureCelsius } from "react-icons/tb";

interface weather {
  name: String;
  main: {
    temp: number;
    feels_like: number;
    temp_max: number;
    temp_min: number;
  };
  weather: [
    {
      icon: String;
      description: String;
      main: String;
    }
  ];
}

type Props = {
  weatherData: weather | undefined;
  Icon: String
}

const Weather:React.FC<Props> = ({weatherData, Icon }) => {
  const [modal, setModal] = useState<boolean>(false);
  const modalclose = useRef<HTMLDivElement>(null)

  let iconurl = "http://openweathermap.org/img/w/" + Icon + ".png";

  useEffect(() => {
      const clickOutside = (e: any) => {
        if (modal && !modalclose.current?.contains(e.target)) {
          setModal(false)
        }
      }
      document.addEventListener('mousedown', clickOutside)
      return () => {
        document.removeEventListener('mousedown', clickOutside)
      }
    }, [modal])


  return (
    <>
        <div className="flex flex-col cursor-pointer bg-black/30 rounded-xl p-1"  onClick={() => setModal(true)}>
            <div className="flex gap-2 items-center">
                <div>
                    {weatherData ? (
                        <img className="w-10 h-10" src={iconurl} alt="icon"></img>
                    ) : null}
                    </div>
                    <div className="text-3xl font-bold flex items-center gap-1">
                    {weatherData?.main.temp !== undefined ? (
                        Math.ceil(weatherData.main.temp)
                    ) : (
                        null
                    )}
                    <TbTemperatureCelsius />
                </div>
            </div>
            <div className="flex justify-center">
                <h1 className="text-2xl font-bold">{weatherData?.name}</h1>
            </div>
        </div>
        {/*  dropDown */}
                        
        {modal ? (
            <div ref={modalclose} className="opacity-100 transition-all bg-white/80 w-80 sm:w-96 h-48 text-black absolute mt-2 drop-shadow-lg border-none rounded-lg p-4 right-0">
            <h1 className="text-4xl font-bold">{weatherData?.name}</h1>
            <div className="text-xl text-gray-400">{weatherData?.weather[0].main}</div>
            <div className="flex justify-around mt-4">
                <div>
                    {weatherData ? (
                        <img className="w-20 h-20" src={iconurl} alt="icon"></img>
                    ) : null}
                </div> 
                <div className="text-4xl pb-2 font-bold flex items-center gap-1">
                    {weatherData?.main.temp !== undefined ? (
                        Math.ceil(weatherData.main.temp) 
                    ) : (
                        null
                    )}
                    <TbTemperatureCelsius />
                </div>
                <div>
                <div>
                    <div><span className="text-gray-400">Feels like </span>{weatherData?.main.feels_like !== undefined ? (
                        Math.ceil(weatherData.main.feels_like) 
                    ) : (
                        null
                    )}
                    <span className="ml-1">º</span>
                    </div>
                </div>
                <div>
                    <div><span className="text-gray-400">Temp Max</span> {weatherData?.main.temp_max !== undefined ? (
                        Math.ceil(weatherData.main.temp_max) 
                    ) : (
                        null
                    )}
                    <span className="ml-1">º</span>
                    </div>
                </div>
                <div>
                    <div><span className="text-gray-400">Temp Min</span> {weatherData?.main.temp_min !== undefined ? (
                        Math.ceil(weatherData.main.temp_min)  
                    ) : (
                        null
                    )}
                    <span className="ml-1">º</span>
                    </div>
                </div>
                </div>
            </div>
        </div>
        ) : (
          <div className="bg-white w-80 sm:w-96 h-48 opacity-0 rounded-lg p-4 right-52 absolute">

          </div>
        )}
    </>
  );
};

export default Weather;
