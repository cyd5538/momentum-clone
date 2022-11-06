## React+TypeScript로  <span style="background-color: #f0f">Momentum 이라는 크롬 확장 프로그램</span>을 클론 코딩 
![](https://velog.velcdn.com/images/cyd5538/post/a8127a46-2c18-4144-80e6-ccc0c8cccf3e/image.png)
>**vite를** 사용하면 템플릿 설정으로 react와 typescript를 고를 수 있다, style은 **tailwindcss로** 할 생각이다.

**vite의 장점**
* serve, build 시 체감속도가 웹팩보다 빠릅니다. ...
* 웹팩에 비해 config 라인 수가 적습니다. ...
* 빌드 최적화와 SSR 설정에 대해 지원해 주고 있어 간편하게 설정 가능합니다.
* 웹팩 설정에 대한 경험이 있다면 vite도 빠르게 구성 가능합니다.

## 1. 첫번째 기능으로 날씨정보를 오른쪽 상단에 배치

사용자의 위도와 경도를 받아와서 openweatherAPi에 넣어서 날씨 정보를 가져오면 된다. 사용자의 위도 경도를 가져오려고 <span style="background-color: #ff0">**useGeoLocation() hooks**</span>를 사용했다. typescript를 적용한 결과 아래와 같다.
```javascript
import { useState, useEffect } from "react";

interface type {
    loaded: boolean;
    coordinates?: {
        lat: number;
        lng: number;
    };
    error?: { code: number; message: string };
}

const useGeoLocation = () => {
  const [location, setLocation] = useState<type>({
    loaded: false,
    coordinates: { lat: 0, lng: 0},
  });


  const onSuccess = (location: { coords: { latitude: number; longitude: number; }; }) => {
    setLocation({
      loaded: true,
      coordinates: {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      },
    });
  };

  const onError = (error: { code: number; message: string; }) => {
    setLocation({
      loaded: true,
      error,
    })
  }
  useEffect(() => {
    if (!("geolocation" in navigator)) {
      onError({
        code: 0,
        message: "Geolocation not supported",
      });
    }
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  
}, []);

  return location;
};

export default useGeoLocation;
```

hooks를 불러와서 다음과 같이 openweather API에 적용해주었다
``` javascript
  const location = useGeoLocation();

  const lat: number | undefined = location.coordinates?.lat;
  const lng: number | undefined = location.coordinates?.lng;

  const WeatherGet = async () => {
    const API_KEY = "";

    await axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric&lang=kr`
      )
      .then((res) => {
        setWeatherData(res.data);
        setIcon(res.data.weather[0].icon);
      });
  };
```

이렇게 가져온 결과를 뿌려준뒤 css를 적용해서 다음과 같이 나왔다. 사실 작업을 조금 하고 글을 쓰는거기 때문에 배경에 대한 설명은 나중에 하겠다.
![](https://velog.velcdn.com/images/cyd5538/post/abe9b0c4-20f4-44ec-ac9b-00f10319acd5/image.png)

저기까지 완료했는데 Momentum을 보면 저 날씨를 클릭하면 모달창으로 상세정보가 나와서 모달창을 만들기로 했다.
모달창 밖을 클릭하면 modal이 닫히게 하는 방법은 아래처럼 하면 된다.

```javascript
  const [modal, setModal] = useState<boolean>(false);
  const modalclose = useRef<HTMLDivElement>(null)
  
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
```

날씨창을 클릭하면 아래와 같이 나온다 
css까지 구현한 화면
![](https://velog.velcdn.com/images/cyd5538/post/115001ab-7bdd-459d-b487-31db88df2ac5/image.png)



## 2. 2번쨰 기능 날씨에 맞는 백그라운드
배경에 대한 말을 이제하는데 배경은 사실 저 서울 밑에 Clouds 저 검색어를 unsplash api 이미지검색에 넣어서 가져온 이미지를 랜덤으로 하나 뽑아와서 백그라운드에 넣었다.

useAxios hooks를 사용했다
```javascript
import { useState, useEffect } from 'react';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

axios.defaults.baseURL = `https://api.unsplash.com/search/photos?page=1&query=`;

export const useAxios = (axiosParams: AxiosRequestConfig) => {
  const [response, setResponse] = useState<AxiosResponse>();
  const [error, setError] = useState<unknown>();
  const [loading, setLoading] = useState(true);

 const fetchData = async (params: AxiosRequestConfig) => {
    try {
      const result = await axios.request(params);
      setResponse(result);
    } catch( err ) {
      setError(err);
    } finally {
      setLoading(false);
    }
 };

useEffect(() => {
  fetchData(axiosParams);
},[]);

 return { response, error, loading };
}

```

불러올떄는 아래와 같이 사용한다 이미지가 배열에 20개씩 들어오는데 거기서 하나를 랜덤으로 뽑아서 넣어줬다.

```javascript
  const { response, loading, error } = useAxios({
    method: "get",
    url: `${search}&${API_KEY}=landscape&per_page=20`,
  });

  useEffect(() => {
    if (response !== null) {
      // 20개 중에 랜덤으로 한개 추출
      let sPick = Math.floor(Math.random() * response?.data.results.length);
      setData(response?.data.results[sPick]);
      console.log(response?.data.results[sPick]);
    }
  }, [response]);
```

## 3번째 기능으로는 화면 중간에 시간과 이름을 저장해서 화면에 띄우고, 오늘 할일을 적는 기능이다
다음은 momentum 화면이다
![](https://velog.velcdn.com/images/cyd5538/post/db434e47-4288-4a8e-adb4-2b9938051444/image.png)

일단 시간은 다음과 같이 간단하게 구현했다
```javascript
import React, {useState, useEffect} from 'react'

const Day = () => {
    const [clockState, setClockState] = useState<string>();

    useEffect(() => {
        setInterval(() => {
          const date = new Date();
          setClockState(date.toLocaleTimeString());
        }, 1000);
      }, []);

  return (
    <div className='mb-4 text-center'>{clockState}</div>
  )
}

export default Day
```

그리고 저 이름 설정하는 거를 서버없이 해야해서 localstorage를 사용했다.
![](https://velog.velcdn.com/images/cyd5538/post/f452a2f5-7ebb-460b-8715-78220deaf140/image.gif)
```javascript
  const handleSubmitName = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setName(name);
    localStorage.setItem("name", JSON.stringify(name));
    setTutorial(true);
  }
  

  // localstorage에 name이 있으면 가져오기
  const LOCALSTORAGE_NAME = localStorage.getItem("name")?.replace(/\"/gi, "");
```


```javascript
  {!LOCALSTORAGE_NAME ? (
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
          <div className="absolute top-1/4 right-1/2 translate-x-2/4 text-white text-7xl font-bold p-4 rounded-xl">
            <Day />
            <div className="flex justify-center gap-4 items-center">
              <div className="text-5xl text-center mb-4">Hello {name ? name : LOCALSTORAGE_NAME}</div>
              <div className="text-2xl text-center text-white"><BsThreeDots/></div>
            </div>
            <div className="text-center text-3xl">What is your main focus for today?</div>
            <input
              value={todo}
              onChange={(e) => setTodo(e.target.value)}
              type="text"
              className="border-b-2 font-boldf w-full bg-transparent text-2xl pb-2 text-center outline-none"
            />
          </div>
        </>
      )}
```

가운데 todo는 아래와 같이 작성하였다
```javascript
import React, { useState, useRef, useEffect } from "react";
import { BsThreeDots } from "react-icons/bs";
import { GrClear } from "react-icons/gr";
import { AiOutlineEdit } from "react-icons/ai";

interface Todo {
  todo: string;
  isDone: boolean;
}

const HomeTodo = () => {
  const [todo, setTodo] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoComplete, setTodoComplete] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);
  const modalclose = useRef<HTMLDivElement>(null);

  const handleHomeTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (todo) {
      setTodos([...todos, { todo, isDone: false }]);
      localStorage.setItem("hometodo", JSON.stringify({ todo, isDone: true }));
    }
  };

  const LOCALSTORAGE_HOMETODO = JSON.parse(localStorage.getItem("hometodo"));
  
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

  const handleDelete = () => {
    localStorage.removeItem("hometodo");
    setTodos([]);
  }
  const handleClear = () => {
    localStorage.removeItem("hometodo");
    setTodos([]);
    setTodo("");
  }


  return (
    <>
      {LOCALSTORAGE_HOMETODO?.todo ? (
        <div className="pt-6">
          <div className="text-center text-3xl mb-4">Today</div>
          <div className="text-center text-2xl flex justify-center gap-4 items-center">
            <div>
              <input
                className="w-5 h-5"
                type="checkbox"
                checked={todoComplete}
                onChange={() => setTodoComplete(!todoComplete)}
              />
            </div>
            {todoComplete ? (
              <s>{LOCALSTORAGE_HOMETODO.todo}</s>
            ) : (
              <div>{LOCALSTORAGE_HOMETODO.todo}</div>
            )}
            <div className="relative">
              <div onClick={() => setModal(true)}><BsThreeDots /></div>
              {modal ? 
                <div ref={modalclose} className="font-light w-36 h-16  absolute top-6 right-[-120px] bg-white text-sm text-black flex-row items-center justify-center">
                  <div onClick={handleDelete} className="w-36 h-8 flex items-center justify-start p-2 gap-2 hover:bg-slate-200 cursor-pointer">
                    <AiOutlineEdit /><span>Edit</span>
                  </div>
                  <div onClick={handleClear} className="w-36 h-8 flex items-center justify-start p-2 gap-2 hover:bg-slate-200 cursor-pointer">
                    <GrClear /> <span>Clear</span>
                  </div>
               </div>
              :
              null
              }
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="text-center text-3xl">
            What is your main focus for today?
          </div>
          <form onSubmit={handleHomeTodo}>
            <input
              value={todo}
              onChange={(e) => setTodo(e.target.value)}
              type="text"
              className="border-b-2 font-boldf w-full bg-transparent text-2xl pb-2 text-center outline-none"
            />
          </form>
        </>
      )}
    </>
  );
};

export default HomeTodo;

```
![](https://velog.velcdn.com/images/cyd5538/post/d04cbc95-8c70-4ed1-82c3-803baa2db5dc/image.png)

> localstorage로만 하는데는 한계가 있는것 같다. 저 todo를 넣고 바꾸는것 까지는 가능했는데 check 변경을 locastroage에 반영하는건 실패했다. 다른거부터 만들고 다시 도전해봐야겠다.

## 4번째 기능은 화면 중앙 아래에 명언?을 랜덤으로 넣기.
이거는 사실 배열에 명언을 몇개 넣고 랜덤으로 화면에 가져와서 뿌리는 방식으로 간단하게 했다
설명 생략

## 5번째 기능은 화면 오른쪽 아래에 투두리스트 넣기
기존의 투두리스트를 작게 로컬스토리지를 이용해서 만들었다.
```javascript
const [text, setText] = useState<string>("");
  const [textlist, setTextList] = useState<textlist[]>([]);
  const [modal, setModal] = useState<boolean>(false);


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text) {
      const newTask = { id: Date.now(), text, isBoolean: false }
      setTextList([...textlist, newTask]);
      localStorage.setItem("localTasks", JSON.stringify([...textlist, newTask]));
      setText("");
    }
  };

  useEffect(()=>{
    if(localStorage.getItem("localTasks")){
        const storedList = JSON.parse(localStorage.getItem("localTasks"));
        setTextList(storedList);
    }
  },[])

```
handleSubmit 함수에서 localstroage에 저장을 해주고 useEffect를 사용해서 localstorage에 값이 있으면 setTextList에 넣어주었다.

delete, edit, check 모두 이러한 과정으로 만들었다.
![](https://velog.velcdn.com/images/cyd5538/post/f1850158-1a41-4ecc-8623-c7f3ae166092/image.png)

## 6번째 기능은 왼쪽 상단에 검색바를 만들었다.
```javascript
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
    <div className="fixed top-2 left-4 text-white dark:text-black flex items-center">
      <div className="mr-2">Links</div>
      <form className="flex items-center" onSubmit={handler}>
        <span className="mr-2">
          <BsSearch />
        </span>
        <input
          className="pb-2 pl-2 bg-transparent border-b-2 border-white dark:border-black"
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
            className="flex drop-shadow-2xl bg-white text-black dark:bg-black dark:text-white rounded absolute top-8 flex-col right-[-86px]"
          >
            <div className="pl-2 pr-2 text-xs text-gray-500">SEARCH WITH</div>
            <div
              onClick={() => handleSelected("google")}
              className="gap-1 p-2 cursor-pointer flex items-center hover:bg-gray-200 dark:hover:bg-gray-800"
            >
              <span className="w-6 flex justify-center ">
                <FcGoogle />
              </span>
              Google
            </div>
            <div
              onClick={() => handleSelected("naver")}
              className="gap-1 p-2 cursor-pointer flex items-center hover:bg-gray-200 dark:hover:bg-gray-800"
            >
              <span className="w-6 flex justify-center bold text-lime-500">
                N
              </span>
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

```
자주 이용하는 구글과 네이버를 넣었는데 저 아이콘을 클릭하면 모달창이 나와서 구글,네이버를 고를 수 있다. 그리고 네이버로 검색을 하고 새로고침을 하면 네이버검색이 바로 될 수 있게 localstorage에 저장했다.
![](https://velog.velcdn.com/images/cyd5538/post/bd52b135-4043-4eb6-a6f6-466cf77f5c21/image.png)

## 7 번째 기능은 darkMode
사실 이 기능은 모멘텀에는 없었는데 사진을 임의로 가지고 오다보니깐 사진 배경색에 글씨가 잘 안 보일때가? 있어서 기능을 넣었다. react tailwind로는 처음으로 다크모드를 만들어봤다.
tailwind.config.cjs 파일에 darkMode: "class"를 추가하고 document.element에 클래스를 추가하기만 하면 된다
```javascript
import React, { useState, useEffect, useRef } from "react";
import { BsFillSunFill,BsFillMoonFill } from "react-icons/bs";
import ImageChange from "./ImageChange";

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
        <div className="bg-white/60 flex flex-col items-center text-black dark:bg-black/60 dark:text-white pl-4 pr-4 pt-2 pb-2" ref={modalclose}>
            <ImageChange />
            <label className="mt-4 inline-flex  relative items-center cursor-pointer">
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

```
tailwind에서 darkmode css는 dark:bg-black/60 이런식으로 적으면 된다. 다크모드 또한 localstorage에 저장해서 다크모드를 적용하면 다음에 들어와도 다크모드로 되 구현했다.

## 8번째 마지막기능으로는 배경 키워드를 줘서 그 키워드에 대한 랜덤 배경으로 바꾸는 기능이다.
사실 이 기능도 모멘텀에 없었는데 추가하고싶어서 추가했다.
```javascript
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
```
localstorage에 배경 키워드를 저장하고 App.tsx에 가서 긱존 변수를 아래와 같이 바꿨다. localstorage에 값이 있으면 그 값을 키워드로 넣고 없으면 곧 겨울이니까 winter로 해 놓기.
```javascript
const search = JSON.parse(localStorage.getItem("bg")) ? JSON.parse(localStorage.getItem("bg")) : "winter";
```
![](https://velog.velcdn.com/images/cyd5538/post/aeccb96a-80ca-4ea2-9097-5b2f38faf6b4/image.gif)
![Vite-React-TS-Chrome-2022-11-06-17-13-39](https://user-images.githubusercontent.com/91642972/200166706-c115e99a-843e-4eed-8ba8-132c8cbadcaf.gif)
배포 https://fluffy-florentine-46c11a.netlify.app/

## 소감
typescript를 사용해서 만든 것이 todolist 이후로 처음이었는데 이 프로젝트를 하고나서 typescript에 대해 조금 더 알게 된 것 같고 localstorage를 능숙하게 사용 할 수 있을 것 같다. 
