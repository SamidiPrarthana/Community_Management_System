import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter, Route, Routes } from 'react-router-dom';


import Login from './components/login.js';
import Signup from './components/signup.js';
import ResidentDashbord from './Page/Kavishka/ResidentDashbord.js';
import ApartmentForm from './Page/Kavishka/ApartmentForm.js';
import VehicleRegisterForm from './Page/Kavishka/VehicleRegisterForm.js';
import Userlist from './Page/Kavishka/Dashboard.js';
import Security from './Page/Kavishka/security.js';
import Demoparking from './Page/Kavishka/demoparking.js';
import LeaveTime from './Page/Kavishka/leavingTime.js';
//import SlotMap from './Page/Kavishka/slotMap.js';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

root.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />} />


      <Route path='/signup' element={< Signup />} />
      <Route path='/login' element={<Login />} />
      <Route path='/residentDashbord' element={<ResidentDashbord />} />
      <Route path='/apartmentForm' element={<ApartmentForm />} />
      <Route path='/vehicleRegisterForm' element={<VehicleRegisterForm />} />
      <Route path='/user' element={<Userlist />} />
      <Route path='/security' element={<Security />} />
      <Route path='/demoparking' element={<Demoparking />} />
      <Route path='/leave' element={<LeaveTime />} />



    </Routes>

  </BrowserRouter>,
  document.getElementById("root")
);
