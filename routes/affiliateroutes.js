const express = require('express');
const router = express.Router();


const { handleRegisterAsAffiliate, handleAffiliateLogin } = require('../controller/affiliateController');



router.post('/register', handleRegisterAsAffiliate);
// router.post('/login', handleAffiliateLogin);





module.exports = router; 