
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Landing from './screen/Landing'
import Game from './screen/Game'
// import Test from './components/Test'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
            <Route path='/' element={<Landing/>}></Route>
            <Route path='/game' element={<Game/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
