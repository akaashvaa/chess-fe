import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Landing } from './screens/Landing.tsx'
import { Game } from './screens/Game.tsx'

function App() {
  return (
    <div className=" flex w-screen justify-center items-center">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
