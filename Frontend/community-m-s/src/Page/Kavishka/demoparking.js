import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../Css/app.css';
import moment from 'moment';

function Demoparking() {
    const [form, setForm] = useState({ vehicleNumber: '', vehicleType: '', leavingTime: '07:00', instantAllocate: false });
    const [allocatedSlot, setAllocatedSlot] = useState(null);
    const [dashboard, setDashboard] = useState({ vehicles: [], slots: [] });
    const [error, setError] = useState(null);

    useEffect(() => {
        const savedData = localStorage.getItem('parkingData');
        if (savedData) {
            setDashboard(JSON.parse(savedData));
        }
        fetchDashboard();
    }, []);

    useEffect(() => {
        setForm((prev) => ({
            ...prev,
            leavingTime: '07:00', // Default time
        }));
    }, []);

    const fetchDashboard = async () => {
        try {
            const res = await axios.get('http://localhost:8070/api/dashboard');
            setDashboard(res.data);
            localStorage.setItem('parkingData', JSON.stringify(res.data));
        } catch (err) {
            console.error('Dashboard fetch error:', err.message);
            setError('Failed to fetch dashboard data.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.vehicleNumber || !form.vehicleType) {
            setError('Vehicle number and type are required.');
            return;
        }
        try {
            const payload = {
                vehicleNumber: form.vehicleNumber,
                vehicleType: form.vehicleType,
                leavingTime: form.instantAllocate ? null : form.leavingTime, // Send as HH:mm
                entryTime: moment().format('YYYY-MM-DD HH:mm'),
            };
            console.log('Sending payload:', payload);
            const res = await axios.post('http://localhost:8070/api/allocate_slot', payload);
            const slotNumber = typeof res.data === 'object' && res.data.slot ? res.data.slot : res.data;
            setAllocatedSlot(slotNumber);
            setError(null);
            setForm((prev) => ({
                ...prev,
                vehicleNumber: '',
                vehicleType: '',
                leavingTime: '07:00',
                instantAllocate: false,
            }));
            fetchDashboard();
        } catch (err) {
            console.error('Allocation error:', err.response?.data?.error || err.message);
            setError(err.response?.data?.error || 'Allocation failed. Check logs.');
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const freeSlot = async (slot) => {
        try {
            await axios.post('http://localhost:8070/api/free_slot', { slot });
            fetchDashboard();
            setError(null);
        } catch (err) {
            console.error('Free slot error:', err.message);
            setError('Failed to free slot.');
        }
    };

    return (
        <div className="app">
            <div className="form-container">
                <h2>Parking Slot Allocation</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="vehicleNumber"
                        placeholder="Vehicle Number"
                        value={form.vehicleNumber}
                        onChange={handleChange}
                        required
                    />
                    <select name="vehicleType" value={form.vehicleType} onChange={handleChange} required>
                        <option value="">Select Vehicle Type</option>
                        <option value="Car">Car</option>
                        <option value="Bike">Bike</option>
                        <option value="Van">Van</option>
                    </select>
                    <label>
                        Leaving Time (Tomorrow):
                        <input
                            type="time"
                            name="leavingTime"
                            value={form.leavingTime}
                            onChange={handleChange}
                            required={!form.instantAllocate}
                            min="07:00"
                            max="23:59" // Extended to 11:59 PM
                            disabled={form.instantAllocate}
                        />
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="instantAllocate"
                            checked={form.instantAllocate}
                            onChange={handleChange}
                        /> Instant Allocate (No Leaving Time)
                    </label>
                    <button type="submit">Allocate Slot</button>
                </form>
                {allocatedSlot !== null && <h3>Allocated Slot: {allocatedSlot}</h3>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>

            <div className="slot-map">
                <h2>Parking Slot Map</h2>
                <div className="slots-grid">
                    {dashboard.slots && dashboard.slots.length > 0 ? (
                        dashboard.slots.map((slot) => (
                            <div
                                key={slot.slotNumber}
                                className={`slot-card ${slot.status === 'free' ? 'free' : 'occupied'}`}
                                onClick={() => slot.status === 'occupied' && freeSlot(slot.slotNumber)}
                            >
                                <div className="slot-number">Slot {slot.slotNumber}</div>
                                <div className="slot-status">
                                    {slot.status === 'occupied' ? 'Occupied' : 'Free'}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No slots available.</p>
                    )}
                </div>
            </div>

            <div className="dashboard">
                <h2>Security Dashboard</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Slot</th>
                            <th>Vehicle Number</th>
                            <th>Vehicle Type</th>
                            <th>Leaving Time</th>
                            <th>Entry Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dashboard.vehicles.map((vehicle) => (
                            <tr key={vehicle.slot}>
                                <td>{vehicle.slot}</td>
                                <td>{vehicle.vehicleNumber}</td>
                                <td>{vehicle.vehicleType}</td>
                                <td>{vehicle.leavingTime}</td>
                                <td>{vehicle.entryTime}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Demoparking;