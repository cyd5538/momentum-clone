import { useState } from 'react'
import Weather from './components/weather/Weather'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="h-screen w-full  text-white bg-purple-500 relative">
      <div className='absolute right-4 top-4'>
        <Weather />
      </div>
    </div>
  )
}

export default App
