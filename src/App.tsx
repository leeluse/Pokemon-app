import React from 'react'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import MainPage from './Pages/MainPage'
import DetailPage from './Pages/DetailPage'
import LoginPage from './components/LoginPage'
import NavBar from './components/NavBar'
import { v4 } from './assets/uuid'

const Layout = () => {
  return (
    <>
      <NavBar />
      <br/>
      <br/>
      <br/>
      <Outlet />
    </>
  )
}



const App = () => {
  return  (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Layout />}>
      <Route index element={<MainPage />}/>
      <Route path='login' element={<LoginPage />}/>
      <Route path='/pokemon/:id' element={<DetailPage />}/>
      </Route>
    </Routes>
    </BrowserRouter>
    ) 
}

export default App  