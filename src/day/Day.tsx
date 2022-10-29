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