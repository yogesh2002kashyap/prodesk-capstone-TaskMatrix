const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'dummy_key');

//POST /api/stripe/create-checkout-session
const createCheckoutSession = async (req, res) => {
    if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(500).json({ message: 'Stripe API key is not configured' });
    }
    if (!process.env.STRIPE_PRICE_ID) {
        return res.status(500).json({ message: 'Stripe price ID is not configured' });
    }

    try{
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription',
            line_items: [
            {
              price: process.env.STRIPE_PRICE_ID,
              quantity: 1,
            },
            ],
            success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/board`,
            customer_email: req.user?.email || undefined,
        });
        res.status(200).json({url:session.url})
    } catch (error){
        res.status(500).json({message:"Failed to create checkout session",
            error:error.message
        });
    }
};

//GET /api/stripe/session/:sessionId
const getSession = async (req, res) => {
    if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(500).json({ message: 'Stripe API key is not configured' });
    }

    try{
        const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
        res.status(200).json({
            status:session.payment_status,
            customerEmail: session.customer_details?.email,
            plan:'pro',
        }) 
    }catch(err) {
        res.status(500).json({message:'Failed to retrieve session', error:err.message})
    }
};

module.exports = { createCheckoutSession, getSession };