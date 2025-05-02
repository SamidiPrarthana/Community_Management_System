const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const cors = require('cors')
const app = express()
const host = 'localhost';
const logger = require('./src/utils/logger');


require('dotenv').config();
const dotenv = require("dotenv");

const PORT = process.env.PORT || 8070
app.use(cors())
app.use(bodyParser.json())
app.use(cookieParser());
app.use(express.json());


app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).send('Something broke!');
});


const uri = process.env.MONGO_URI

// Logging configuration
const morganMiddleware = require("./src/utils/morganMiddleware");
app.use(morganMiddleware);


const connect = async () => {
    try {
        await mongoose.connect(uri);
        console.log('Connected to mongoDB !!..');
    }
    catch (error) {
        console.log('MongoDB Error: ', error);
    }
};
connect();

const server = app.listen(PORT, host, () => {

    console.log(`Node server is listening to ${server.address().port}`)

});



const userRoutes = require('./src/routes/Kavishka/userRouter');
app.use('/api/users', userRoutes);



const vehicleRoutes = require('./src/routes/Kavishka/vehicleRoutes');
app.use('/api/vehicles', vehicleRoutes);

const apartmentRoutes = require('./src/routes/Kavishka/apartmentRoutes');
app.use('/api/apartments', apartmentRoutes);

const leavingTimeRouters = require('./src/routes/Kavishka/leavingTimeRouters');
app.use("/api/leavetime", leavingTimeRouters);



const parkingRoutes = require('./src/routes/Kavishka/parkingRoutes');
app.use('/api', parkingRoutes);