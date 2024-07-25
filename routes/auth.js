const express = require('express');
const { register, login ,get_user,get_register,offlineregister,paymentverification,get_offline,get_payment ,get_onlinepayment,getuser_by_id} = require('../controller/authController');

const {admin_login} = require('../controller/adminCo');
const authMiddleware = require('../middleware/authMiddleware');
const {getorderdetails_by_userid,checkout,paymentverification_students} = require('../controller/checkoutController'); 

const router = express.Router();

router.get('/get_register', get_register);
 router.post('/offlineregister', offlineregister);
 //for offline student  paymentverification
 router.post('/paymentverification', paymentverification);
 //for online student create order api(checkout)
 router.post('/checkout', checkout);
 //for online student get order details by userid
 router.get('/orderdetails/:id',getorderdetails_by_userid)
  //for online student payment verification(paymentverification_students)
 router.post('/paymentverification_students', paymentverification_students);
 
router.post('/register', register);
 router.get('/getuser', authMiddleware,get_user);
 router.get('/getuser/:id', getuser_by_id);
 router.get('/getofflineuser', get_offline);
 router.get('/getpayment', get_payment);
 //for online users payment details
 router.get('/get_onlinepayment', get_onlinepayment);
router.post('/login',login);
 //admin login
router.post('/admin',admin_login )



module.exports = router; // Export the router