const Affiliate = require('../model/affiliate-models/affiliate');
const User = require('../model/student');




// 1. Function to generate Refferal code
async function generateAffiliateCode() {
    let isUnique = false;
    let randomNumber;
    
    // Keep generating until a unique number is found
    while (!isUnique) {
      randomNumber = generateRandom7DigitNumber();
      const existingUser = await Affiliate.findOne({ affiliateCode: `SA${randomNumber}` });
      if (!existingUser) {
        isUnique = true;
      }
    }
    
    return `SA${randomNumber}`;
}


// helper function
function generateRandom7DigitNumber() {
    const min = 1000000; // Minimum 7-digit number
    const max = 9999999; // Maximum 7-digit number
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
  





module.exports = {
    generateAffiliateCode
};