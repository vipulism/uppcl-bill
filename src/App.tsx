import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Bill from './component/bill'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
       
          <img src={viteLogo} className="logo" alt="Vite logo" />
       
      </div>
   
      <Bill></Bill>
    </>
  )
}

export default App
