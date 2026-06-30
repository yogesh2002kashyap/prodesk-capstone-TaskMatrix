const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

//POST /api/stripe/create-checkout-session
const createCheckoutSession = async (req, res) => {
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
            constomer_email: req.user?.email || undefined,
        });
        res.status(200).json({url:session.url})
    } catch (error){
        res.status(500).json({message:"Failed to create checkout session",
            error:error.message
        });
        
    };

    //GET /api/stripe/session/:sessionId
    const getSession = async (req, res) => {
            try{
                const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
                res.status(200).json({
                    status:session.payment.status,
                    customerEmail: session.customer_details?.email,
                    plan:'pro',
                }) 
            }catch(err) {
                res.status(500).json({message:'failed to retrivr session', error:err.message})
            }
        }
    };

module.exports = { createCheckoutSession, getSession };