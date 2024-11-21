const Checkout = require('../model/checkout');
const instance = require('../server.js');
const crypto = require('crypto');
require('dotenv').config();
const Affiliate = require('../model/affiliate-models/affiliate.js');
const Earning = require('../model/affiliate-models/earning.js');

exports.getorderdetails_by_userid = async (req, res) => {
  try {
    const userId = req.params.id;
    const orderdetails = await Checkout.find({ userId });
    if (!orderdetails) {
      return res.status(404).json({ error: 'user not found' });
    }
    res.status(200).json(orderdetails);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
//order details by its orderid
exports.getorderdetails_by_orderid = async (req, res) => {
  try {
    const orderdetails = await Checkout.findById(req.params.id);
    if (!orderdetails) {
      return res.status(404).json({ error: 'order not found' });
    }
    res.send({ status: "ok", data: orderdetails })
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.checkout = async (req, res) => {
  try {
    const options = {
      amount: Number(req.body.amount * 100),
      //amount: 5000,
      currency: "INR"
    };
    const order = await instance.orders.create(options)
    console.log(order);
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(400).send('Internal Server Error');
  }
};

exports.paymentverification_students = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  console.log(razorpay_order_id);
  console.log(razorpay_payment_id);
  console.log(razorpay_signature);
  try {
    const { fullname, userId, phoneno, state, city, email, id, courses, amount, razorpay_order_id, razorpay_payment_id, razorpay_signature, affiliateCode } = req.body;

    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_API_SECRET);
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');
    console.log(generated_signature);
    console.log(id);
    console.log(razorpay_signature);
    if (generated_signature === razorpay_signature) {
      const paymentdetails_student = new Checkout({ fullname, userId, phoneno, state, city, email, id, courses, amount, razorpay_order_id, razorpay_payment_id, razorpay_signature });
      console.log('Saving user data:', paymentdetails_student);
      try {
        await paymentdetails_student.save();
        if (affiliateCode) {
          await addComissionToAffiliate(affiliateCode, courses, amount, amount * 0.1);
        }
        return res.redirect(process.env.FRONTEND_LOCALHOST_URL + '/paymentSucess');
        //  console.log('student paymentdata saved successfully');
      } catch (error) {
        console.error('Error saving user data:', error.message);
      }
    }
  } catch (error) {
    console.error('Error creating Razorpay:', error);
    res.status(400).send({ status: 'failure' });
  }
};


// helper function
const addComissionToAffiliate = async (affiliateCode, courseId, coursePrice, commissionAmount) => {
  try {
    // Find the affiliate using the affiliate code
    const affiliate = await Affiliate.findOne({ affiliateCode });

    if (!affiliate) {
      throw new Error('Affiliate not found for the provided affiliate code.');
    }

    // Update or create an earning record for the affiliate
    const existingEarning = await Earning.findOne({
      'affiliateDetails.affiliateId': affiliate.userId,
      'affiliateDetails.affiliateCode': affiliateCode,
    });

    if (existingEarning) {
      // If earning record exists, update the earning details
      existingEarning.earningDetails.push({
        courseId,
        coursePrice,
        earning: commissionAmount,
      });
      await existingEarning.save();
    } else {
      // If no earning record exists, create a new one
      const newEarning = new Earning({
        affiliateDetails: {
          affiliateId: affiliate.userId,
          affiliateCode,
        },
        earningDetails: [
          {
            courseId,
            coursePrice,
            earning: commissionAmount,
          },
        ],
      });
      await newEarning.save();
    }

    console.log(`Commission added successfully for affiliate ${affiliateCode}`);
  } catch (error) {
    console.error('Error adding commission:', error.message);
    throw new Error('Failed to add commission to affiliate.');
  }
};







exports.gettotalamount = async (req, res) => {
  try {
    const orders = await Checkout.find({});
    const totalAmount = orders.reduce((total, order) => total + parseFloat(order.amount), 0);
    res.json({ totalAmount });

    if (!orders) {
      return res.status(404).json({ error: 'total amount  not found' });
    }
    // res.send({ status:"ok", data:course })
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getmonthlytotal = async (req, res) => {
  try {
    const monthlytotal = await Checkout.aggregate([
      {
        $group: {
          _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
          totalAmount: { $sum: '$amount' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    res.json(monthlytotal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


