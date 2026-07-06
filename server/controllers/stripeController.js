const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { sendSuccess, sendError } = require('../utils/apiError');

//POST /api/stripe/create-checkout-session
const createCheckoutSession = async (req, res, next) => {
    if (!process.env.STRIPE_SECRET_KEY) {
        return sendError(res, 500, 'Stripe API key is not configured');
    }
    if (!process.env.STRIPE_PRICE_ID) {
        return sendError(res, 500, 'Stripe price ID is not configured');
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
        return sendSuccess(res, 200, {url:session.url}, 'Checkout session created successfully');
    } catch (err){
        next(err);
    }
};

//GET /api/stripe/session/:sessionId
const getSession = async (req, res, next) => {
    if (!process.env.STRIPE_SECRET_KEY) {
        return sendError(res, 500, 'Stripe API key is not configured');
    }

    try{
        const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
        return sendSuccess(res, 200, {
            status:session.payment_status,
            customerEmail: session.customer_details?.email,
            plan:'pro',
        }, 'Checkout session retrieved successfully');
    }catch(err) {
        next(err);
    }
};

module.exports = { createCheckoutSession, getSession };