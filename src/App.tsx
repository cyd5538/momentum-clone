import React, { useEffect, useState, useRef } from "react";
import Weather from "./components/weather/Weather";
import { useAxios } from "./Hooks/useAxios";
import useGeoLocation from "./Hooks/useGeoLocation";
import axios from "axios";
import Day from "./components/day/Day";
import HomeName from "./components/HomeName/HomeName";
import HomeTodo from "./components/HomeTodo/HomeTodo";
import FamousSayings from "./components/FamousSayings/FamousSayings";
import TodoList from "./components/TodoList/TodoList";
import Search from "./components/Search/Search";
import Etc from "./components/etc/Etc";

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

interface pic {
  urls: {
    full: string;
  };
}

function App() {
  const [name, setName] = useState<string>("");
  const [tutorial, setTutorial] = useState<boolean>(false);
  const [data, setData] = useState<pic>();
  const [weatherData, setWeatherData] = useState<weather>();
  const [Icon, setIcon] = useState<string>("");
  // const [search, setSearch] = useState<string>('');
  const location = useGeoLocation();

  const lat: number | undefined = location.coordinates?.lat;
  const lng: number | undefined = location.coordinates?.lng;

  const WeatherGet = async () => {

    await axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=29975ab2f4a94fa0957a44c383fe3b08&units=metric&lang=kr`
      )
      .then((res) => {
        setWeatherData(res.data);
        setIcon(res.data.weather[0].icon);
      });
  };

  useEffect(() => {
    if (lat !== 0) {
      WeatherGet();
    }
  }, [lat, lng]);

  // 배경 api에 들어갈 변수
  const search = JSON.parse(localStorage.getItem("bg")) ? JSON.parse(localStorage.getItem("bg")) : "winter";

  const { response, loading, error } = useAxios({
    method: "get",
    url: `${search}&client_id=Akd0vXXXO0l9zVUmQ-QuFMkPVkIcu51vPa-0Kif4z08&orientation=landscape&per_page=20`,
  });

  const handleBg = () => {
    if (response !== null) {
      // 20개 중에 랜덤으로 한개 추출
      let sPick = Math.floor(Math.random() * response?.data.results.length);
      setData(response?.data.results[sPick]);
    }
  }

  useEffect(() => {
    handleBg()
  }, [response]);

  const handleSubmitName = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setName(name);
    localStorage.setItem("name", JSON.stringify(name));
    setTutorial(true);
  }
  
  useEffect(() => {
    if(localStorage.getItem("name")){
      setTutorial(true);
      const name = JSON.parse(localStorage.getItem("name"));
      setName(name);
    }
  },[])


  if (loading) {  
    return (
      <div
        className="w-full h-screen flex items-center justify-center"
        role="status"
      >
        <svg
          className="inline mr-2 w-32 h-32 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <div className="h-screen w-full  text-white dark:text-black relative">
      <img
        src={data?.urls.full}
        alt=""
        className="h-screen w-full object-cover"
      />

      {!tutorial ? (
        <div className="absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2  rounded-xl">
            <div className="text-5xl font-bold text-center">Hello, What's your name? </div>
          <form onSubmit={handleSubmitName} className="mt-8">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              className="border-b-2 font-boldf w-full bg-transparent text-4xl pb-4 text-center outline-none"
            />
          </form>
        </div>
      ) : (
        <>
          <div className="absolute right-4 top-4 z-10">
            <Weather Icon={Icon} weatherData={weatherData} />
          </div>
          <div className="bg-white/30 dark:bg-black/60  absolute top-1/4 right-1/2 translate-x-2/4 text-black text-6xl font-bold p-8 rounded-xl">
            <Day />
            <HomeName name={name} setName={setName}/>
            <HomeTodo />
          </div>
          <div>
            <FamousSayings />
          </div>
          <div>
            <TodoList />
          </div>
          <div>
            <Search />
          </div>
          <div>
            <Etc />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
