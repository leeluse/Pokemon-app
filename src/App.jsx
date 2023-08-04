import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainPage from './Pages/MainPage'
import DetailPage from './Pages/DetailPage'
const App = () => {
  return  (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<MainPage />}/>
      <Route path='/pokemon/:id' element={<DetailPage />}/>
    </Routes>
    </BrowserRouter>
    ) 
}

export default App  