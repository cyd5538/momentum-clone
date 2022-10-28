import React, { useEffect, useState, useRef } from "react";
import Weather from "./components/weather/Weather";
import { useAxios } from "./Hooks/useAxios";
import useGeoLocation from "./Hooks/useGeoLocation";
import axios from "axios";


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
  urls :  
  {
    full : string;
  }

}

function App() {
  const [data, setData] = useState<pic>();
  const [weatherData, setWeatherData] = useState<weather>();
  const [Icon, setIcon] = useState<string>("");

  const location = useGeoLocation();

  const lat: number | undefined = location.coordinates?.lat;
  const lng: number | undefined = location.coordinates?.lng;

  const WeatherGet = async () => {
    const API_KEY = "29975ab2f4a94fa0957a44c383fe3b08";

    await axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric&lang=kr`
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

  const search = weatherData?.weather[0].main;

  const { response, loading, error } = useAxios({
    method: "get",
    url: `${search}&client_id=Akd0vXXXO0l9zVUmQ-QuFMkPVkIcu51vPa-0Kif4z08&orientation=landscape&per_page=20`,
  });

  useEffect(() => {
    if (response !== null) {
      // 20개 중에 랜덤으로 한개 추출
      let sPick = Math.floor(Math.random() * response?.data.results.length);
      setData(response?.data.results[sPick]);
      console.log(response?.data.results[sPick]);
    }
  }, [response]);


  return (
    <div className="h-screen w-full  text-white bg-purple-500 relative">
      <img src={data?.urls.full} alt="" className="h-screen w-full object-cover"/>
      <div className="absolute right-4 top-4">
        <Weather Icon={Icon} weatherData={weatherData}/>
      </div>
    </div>
  );
}

export default App;
