const moment = require('moment');
const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, 'parkingData.json');

// Initialize default data if no file exists
const initializeData = async () => {
    try {
        await fs.access(DATA_FILE);
    } catch (err) {
        const initialSlots = Array.from({ length: 30 }, (_, i) => {
            const slotNumber = i + 1;
            let reservedForTime = null;
            if (slotNumber >= 7 && slotNumber <= 10) reservedForTime = '07:00'; // 7:00 AM - 8:00 AM
            if (slotNumber >= 10 && slotNumber <= 15) reservedForTime = '08:00'; // 8:00 AM - 9:00 AM
            if (slotNumber >= 15 && slotNumber <= 20) reservedForTime = '09:00'; // 9:00 AM - 10:00 AM
            return {
                slotNumber,
                status: 'free',
                reservedForTime,
            };
        });
        const initialData = { slots: initialSlots, vehicles: [] };
        await fs.writeFile(DATA_FILE, JSON.stringify(initialData, null, 2));
        console.log('Initialized 30 slots');
    }
};

// Load data from file
const loadData = async () => {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
};

// Save data to file
const saveData = async (data) => {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
};

const initializeSlots = async () => {
    await initializeData();
};

const allocateSlot = async ({ vehicleNumber, vehicleType, leavingTime, entryTime = moment().format('YYYY-MM-DD HH:mm') }) => {
    console.log('Allocation request received:', { vehicleNumber, vehicleType, leavingTime, entryTime });
    const data = await loadData();
    const entryMoment = moment(entryTime, 'YYYY-MM-DD HH:mm');
    const tomorrowDate = moment().add(1, 'days').format('YYYY-MM-DD');

    // Parse leaving time and fix to tomorrow date
    let leavingMoment = leavingTime ? moment(leavingTime, 'HH:mm') : null; // Parse as time only
    let leavingTimeHourMinute = leavingMoment ? leavingMoment.format('HH:mm') : null;

    if (leavingTime && !leavingMoment.isValid()) {
        leavingMoment = moment(`${tomorrowDate} ${leavingTime}`, 'YYYY-MM-DD HH:mm');
        leavingTime = leavingMoment.format('YYYY-MM-DD HH:mm');
        leavingTimeHourMinute = leavingMoment.format('HH:mm');
        console.log('Parsed leaving time:', leavingTime);
    } else if (leavingTime) {
        leavingTime = `${tomorrowDate} ${leavingTimeHourMinute}:00`; // Append date and seconds
    }

    // Day-to-day update: Free slots where leaving time has passed
    for (const slot of data.slots) {
        const lastVehicle = data.vehicles.find(v => v.slot === slot.slotNumber && v.isActive);
        if (lastVehicle) {
            const lastLeavingMoment = moment(lastVehicle.leavingTime, 'YYYY-MM-DD HH:mm');
            if (moment().isAfter(lastLeavingMoment)) {
                slot.status = 'free';
                lastVehicle.isActive = false;
                console.log(`Slot ${slot.slotNumber} freed as leaving time ${lastLeavingMoment.format('YYYY-MM-DD HH:mm')} passed`);
            }
        }
        // Free slots based on reserved time ranges
        if ([7, 8, 9, 10].includes(slot.slotNumber)) {
            const currentHour = moment().format('HH:mm');
            if (currentHour >= '08:00' && slot.status === 'occupied' && (!lastVehicle || moment(lastVehicle.leavingTime, 'HH:mm').isSame(moment('07:00', 'HH:mm')))) {
                slot.status = 'free';
                if (lastVehicle) lastVehicle.isActive = false;
                console.log(`Slot ${slot.slotNumber} freed after 8:00 AM`);
            }
        }
        if ([10, 11, 12, 13, 14, 15].includes(slot.slotNumber)) {
            const currentHour = moment().format('HH:mm');
            if (currentHour >= '09:00' && slot.status === 'occupied' && (!lastVehicle || moment(lastVehicle.leavingTime, 'HH:mm').isSame(moment('08:00', 'HH:mm')))) {
                slot.status = 'free';
                if (lastVehicle) lastVehicle.isActive = false;
                console.log(`Slot ${slot.slotNumber} freed after 9:00 AM`);
            }
        }
        if ([15, 16, 17, 18, 19, 20].includes(slot.slotNumber)) {
            const currentHour = moment().format('HH:mm');
            if (currentHour >= '10:00' && slot.status === 'occupied' && (!lastVehicle || moment(lastVehicle.leavingTime, 'HH:mm').isSame(moment('09:00', 'HH:mm')))) {
                slot.status = 'free';
                if (lastVehicle) lastVehicle.isActive = false;
                console.log(`Slot ${slot.slotNumber} freed after 10:00 AM`);
            }
        }
    }

    let freeSlots = data.slots.filter(slot => slot.status === 'free');
    console.log('Available free slots:', freeSlots.map(s => s.slotNumber));
    if (freeSlots.length === 0) {
        throw new Error('No free slots available');
    }

    let selectedSlot = null;

    if (leavingTime) {
        const leavingHourMinute = moment(leavingTimeHourMinute, 'HH:mm');
        console.log('Leaving time to check:', leavingTimeHourMinute);

        const startTime6 = moment('06:00', 'HH:mm');
        const endTime6 = moment('07:00', 'HH:mm');

        if (leavingHourMinute.isSameOrAfter(startTime6) && leavingHourMinute.isBefore(endTime6)) { // fixed line
            const preferredSlots = freeSlots.filter(slot => slot.slotNumber >= 1 && slot.slotNumber <= 7);
            if (preferredSlots.length > 0) {
                selectedSlot = preferredSlots[0];
                console.log(`Allocated slot ${selectedSlot.slotNumber} for 6:00 AM - 7:00 AM on ${tomorrowDate}`);
            } else {
                throw new Error('No free slots available between 6:00 AM - 7:00 AM');
            }
        }



        // 7:00 AM - 8:00 AM -> Slots 7-10
        const startTime7 = moment('07:00', 'HH:mm');
        const endTime7 = moment('08:00', 'HH:mm');
        if (leavingHourMinute.isSameOrAfter(startTime7) && leavingHourMinute.isBefore(endTime7)) {
            const preferredSlots = freeSlots.filter(slot => slot.slotNumber >= 7 && slot.slotNumber <= 10);
            if (preferredSlots.length > 0) {
                selectedSlot = preferredSlots[0];
                console.log(`Allocated slot ${selectedSlot.slotNumber} for 7:00 AM - 8:00 AM on ${tomorrowDate}`);
            } else {
                throw new Error('No free slots available between 7:00 AM - 8:00 AM');
            }
        }

        // 8:00 AM - 9:00 AM -> Slots 10-15
        const startTime8 = moment('08:00', 'HH:mm');
        const endTime8 = moment('09:00', 'HH:mm');
        if (leavingHourMinute.isSameOrAfter(startTime8) && leavingHourMinute.isBefore(endTime8)) {
            const preferredSlots = freeSlots.filter(slot => slot.slotNumber >= 10 && slot.slotNumber <= 15);
            if (preferredSlots.length > 0) {
                selectedSlot = preferredSlots[0];
                console.log(`Allocated slot ${selectedSlot.slotNumber} for 8:00 AM - 9:00 AM on ${tomorrowDate}`);
            } else {
                throw new Error('No free slots available between 8:00 AM - 9:00 AM');
            }
        }

        // 9:00 AM - 10:00 AM -> Slots 15-20
        const startTime9 = moment('09:00', 'HH:mm');
        const endTime9 = moment('10:00', 'HH:mm');
        if (leavingHourMinute.isSameOrAfter(startTime9) && leavingHourMinute.isBefore(endTime9)) {
            const preferredSlots = freeSlots.filter(slot => slot.slotNumber >= 15 && slot.slotNumber <= 20);
            if (preferredSlots.length > 0) {
                selectedSlot = preferredSlots[0];
                console.log(`Allocated slot ${selectedSlot.slotNumber} for 9:00 AM - 10:00 AM on ${tomorrowDate}`);
            } else {
                throw new Error('No free slots available between 9:00 AM - 10:00 AM');
            }
        }
    }

    if (!selectedSlot) {
        selectedSlot = freeSlots.find(slot => !slot.reservedForTime) || freeSlots[0];
        console.log(`Fallback: Allocated slot ${selectedSlot.slotNumber}`);
    }

    if (!selectedSlot) {
        throw new Error('No suitable slot available');
    }

    selectedSlot.status = 'occupied';
    const vehicle = {
        slot: selectedSlot.slotNumber,
        vehicleNumber,
        vehicleType,
        leavingTime: leavingTime || entryTime,
        entryTime,
        isActive: true,
        createdAt: moment().toISOString(),
    };
    data.vehicles.push(vehicle);
    await saveData(data);
    console.log('Slot allocation successful:', selectedSlot.slotNumber);

    return selectedSlot.slotNumber;
};

const freeSlot = async (slot) => {
    const data = await loadData();
    const targetSlot = data.slots.find(s => s.slotNumber === slot);
    if (targetSlot) {
        targetSlot.status = 'free';
        const vehicle = data.vehicles.find(v => v.slot === slot && v.isActive);
        if (vehicle) vehicle.isActive = false;
        console.log(`Slot ${slot} marked as free and vehicle set inactive`);
        await saveData(data);
    }
};

const getDashboardData = async () => {
    const data = await loadData();
    const vehicles = data.vehicles.filter(v => v.isActive);
    const slots = data.slots;
    return { vehicles, slots };
};

module.exports = { initializeSlots, allocateSlot, freeSlot, getDashboardData };