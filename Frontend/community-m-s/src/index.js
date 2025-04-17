import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter, Route, Routes } from 'react-router-dom';


import Login from './components/login.js';
import Signup from './components/signup.js';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);


root.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />} />


      <Route path='/signup' element={< Signup />} />
      <Route path='/login' element={<Login />} />

    </Routes>

  </BrowserRouter>,
  document.getElementById("root")
);
