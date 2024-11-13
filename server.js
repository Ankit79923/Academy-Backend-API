const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const morgan = require('morgan');
//razorpay
const Razorpay = require('razorpay');
require('dotenv').config();


const app = express();
const instance = new Razorpay({ 
    key_id: process.env.RAZORPAY_API_KEY ,
    key_secret:  process.env.RAZORPAY_API_SECRET })

module.exports = instance;
//Middleware
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
 

// Routes
const authRoutes = require('./routes/auth');
const courseRoute = require('./routes/courseroute');
const contactRoutes = require('./routes/contactroute');
const affiliateRoutes = require('./routes/affiliateroutes');
app.use('/api/auth', authRoutes);
app.use('/api/v1', courseRoute);
app.use('/api/v2', contactRoutes);
app.use('/api/affiliate', affiliateRoutes);
 

//for razorpay

//end razorpay
const PORT = process.env.PORT ||3000;
connectDB().then(()=>{
    app.listen(PORT, ()=> console.log(`Server running on Port ${PORT}`));
})



