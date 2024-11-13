const Affiliate = require('../model/affiliate-models/affiliate');
const User = require('../model/student');
const Checkout = require('../model/checkout');
const { generateAffiliateCode } = require('../utils/generateAffiliateCode');



const handleRegisterAsAffiliate = async function(req, res) {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // Check if the user is already an affiliate
        const isAffiliate = await Affiliate.findOne({ userId });
        if (isAffiliate) {
            return res.status(400).json({ error: "You are already an affiliate." });
        }

        // Check if user has purchased atleast 1 course
        const coursePurchased = await Checkout.findOne({ userId });
        if (!coursePurchased) {
            return res.status(400).json({ error: "You've not purchased any courses. Purchase atleast 1 course to join as Affiliate." });
        }

        // Generate an affiliate code and affiliate link
        const affiliateCode = await generateAffiliateCode();
        const affiliateLink = `https://www.synthosphereacademy.in/register?r=${affiliateCode}`;

        // Create a new affiliate
        const newAffiliate = await Affiliate.create({ 
            userId,
            affiliateCode,
            affiliateLink
        });

        res.status(201).json({ message: "User registered as an affiliate.", affiliate: newAffiliate});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}



const handleAffiliateLogin = async function(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required." });
        }

        // Find the affiliate by email
        const affiliate = await Affiliate.findOne({ email });
        if (!affiliate) {
            return res.status(404).json({ error: "Incorrect Email or Password." });
        }

        // Check if the affiliate is flagged for fraud
        if (affiliate.fraudPrevention.flagged) {
            return res.status(403).json({ 
                error: "Your account has been flagged for fraud prevention.",
                reason: affiliate.fraudPrevention.reason 
            });
        }

        // Verify the password
        const isPasswordValid = await bcrypt.compare(password, affiliate.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Incorrect Email or Password." });
        }

        // Generate and return a JSON Web Token (JWT)
        const token = jwt.sign({ id: affiliate._id, email: affiliate.email, affiliateCode: affiliate.affiliateCode  }, secretKey, { expiresIn: '5h' });
        return res.json({ token, affiliate });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred during login." });
    }
};





module.exports = {
    handleRegisterAsAffiliate,
    handleAffiliateLogin
}