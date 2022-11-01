import React from 'react'

const FamousSayings = () => {
    const sayings = [
        {
            "say" :"Dont't dwell on the past"
        },
        {
            "say" :"Believe in yourself"
        },
        {
            "say" :"Follow your heart"
        },
        {
            "say" :"Follow your heart"
        },
        {
            "say" :"Seize the day"
        },
        {
            "say" :"You only live once."
        },
        {
            "say" :"Past is just past"
        },
        {
            "say" :"Love yourself"
        },
        {
            "say" :"Where there is a will there is a way"
        },
        {
            "say" :"Don't beat yourself up"
        },
        {
            "say" :"Life is a journey"
        },
    ]
    const sayingsRandom = sayings[Math.floor(Math.random() * sayings.length)];
    console.log(sayingsRandom)
  return (
    <div className='text-base text-center fixed bottom-4 text-black right-1/2 translate-x-2/4'>
        {sayingsRandom.say}
    </div>
  )
}

export default FamousSayings