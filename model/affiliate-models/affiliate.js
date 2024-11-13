const mongoose = require("mongoose");

const affiliateSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'User', 
        required: true 
    },
    affiliateCode: { 
        type: String, 
        required: true, 
        unique: true
    },
    affiliateLink: { 
        type: String, 
        unique: true, 
        required: true 
    },
    joiningDate: { 
        type: Date, 
        default: Date.now 
    }
});




const Affiliate = mongoose.model("Affiliate", affiliateSchema);
module.exports = Affiliate;