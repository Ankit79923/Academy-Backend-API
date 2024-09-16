const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const StudentSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    phoneno:{
        type: String,
        required: true,
        unique: true
    },
    date: {
        type: Date,
        required:true
    },
    States:{
        type: String,
        required: true 
    },
    cities: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date, 
       default: Date.now 
   }
});

StudentSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model('User', StudentSchema);