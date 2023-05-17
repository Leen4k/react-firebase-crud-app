import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import UserController from './pages/UserController';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <div className='font-poppins w-[90%] md:w-[50%] m-auto'>
      <BrowserRouter>
        <Navbar />
        <Routes className='font-poppins'>
          <Route path='/' element={<Home />} />
          <Route path='/add' element={<UserController />} />
          <Route path='/update/:id' element={<UserController />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
