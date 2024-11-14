const express = require('express');
const router = express.Router();


const { handleRegisterAsAffiliate, handleGenerateCourseLink, handleAffiliateLogin } = require('../controller/affiliateController');



router.post('/register', handleRegisterAsAffiliate);
router.post('/generate/courselink', handleGenerateCourseLink);
// router.post('/login', handleAffiliateLogin);





module.exports = router; 