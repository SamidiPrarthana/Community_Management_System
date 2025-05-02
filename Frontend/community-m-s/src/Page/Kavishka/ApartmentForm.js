// src/pages/ApartmentForm.js
import React, { useState } from 'react';
import axios from 'axios';

const ApartmentForm = () => {
    const [apartmentNo, setApartmentNo] = useState('');
    const [floor, setFloor] = useState('');
    const [block, setBlock] = useState('');
    const [residentId] = useState(localStorage.getItem('userId')); // logged in user

    const handleSubmit = async (e) => {
        e.preventDefault();

        await axios.post('http://localhost:5000/api/apartment/register', {
            apartmentNo,
            floor,
            block,
            residentId,
        });

        alert('Apartment registered successfully!');
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Apartment Registration</h2>
            <input
                type="text"
                placeholder="Apartment No"
                value={apartmentNo}
                onChange={(e) => setApartmentNo(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Floor"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Block"
                value={block}
                onChange={(e) => setBlock(e.target.value)}
                required
            />
            <button type="submit">Register Apartment</button>
        </form>
    );
};

export default ApartmentForm;
