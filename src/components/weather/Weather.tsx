import React, { useEffect, useState } from "react";
import useGeoLocation from "../../Hooks/useGeoLocation";
import axios from "axios";
import { TbTemperatureCelsius } from "react-icons/tb";

interface weather {
  name: String;
  main: {
    temp: number;
  };
  weather: [
    {
      icon: String;
      description: String;
    }
  ];
}

const Weather = () => {
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

  let iconurl = "http://openweathermap.org/img/w/" + Icon + ".png";
  let temp = weatherData?.main.temp;

  useEffect(() => {
    if (lat !== 0) {
      WeatherGet();
    }
  }, [lat, lng]);
  return (
    <div className="flex flex-col">
      <div className="flex gap-2 items-center">
        <div>
          {weatherData ? (
            <img className="w-12 h-12" src={iconurl} alt="icon"></img>
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
        <h1 className="text-3xl font-bold">{weatherData?.name}</h1>
      </div>
    </div>
  );
};

export default Weather;
