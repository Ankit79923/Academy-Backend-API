const mongoose = require("mongoose");

const earningSchema = new mongoose.Schema({
    affiliateDetails: {
        affiliateId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        affiliateCode: { 
            type: String, 
            required: true, 
            unique: true
        }
    },
    earningDetails: [
        {
            courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'coursemain', required: true },
            coursePrice: { type: Number, required: true },
            earning: { type: Number, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ]
});




const Affiliate = mongoose.model("Earning", earningSchema);
module.exports = Affiliate;