import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Confession from './pages/Confession'
import Posts from './components/Posts'


function Router() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Confession />} />
            <Route path='/:postId' element={<Posts />}/>
        </Routes>
    </BrowserRouter>
  )
}

export default Router
