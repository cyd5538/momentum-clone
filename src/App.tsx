import { useState } from 'react'
import Weather from './components/weather/Weather'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="h-screen w-full bg-purple-800 text-white relative">
      <div className='absolute right-14 top-4'>
        <Weather />
      </div>
    </div>
  )
}

export default App
