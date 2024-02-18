import UserModel from "../models/User.js"
import { stripe } from "../utils/stripe.js"


export async function getPrices(req, res){
    try {
        const prices = await stripe.prices.list({
            apiKey: process.env.STRIPE_SK
        })
        
        res.status(200).json({ success: true, data: prices})
    } catch (error) {
        console.log('FAILED TO FETCH PRICES', error)
        res.status(500).json({ success: false, data: 'Failed to fetch Prices'})
    }
}

export async function paymentSession(req, res){
    const { userId, priceId } = req.body
    try {
        const user = await UserModel.findById({ _id: userId })
        if(!user){
            return res.status(404).json({ success: true, data: 'No User'})
        }
        //if(!user.stripeCustomersId){
        //    return res.status(404).json({ success: true, data: 'Invalid User'})
        //}
        const session = await stripe.checkout.sessions.create(
            {
                mode: 'subscription',
                payment_method_types: ["card"],
                line_items: [
                    {
                        price: priceId,
                        quantity: 1
                    }
                ],
                success_url: process.env.STRIPE_SUCCESS_URL,
                cancel_url: process.env.STRIPE_CANCEL_URL,
                customer: user.stripeCustomersId
            },
            {
                apiKey: process.env.STRIPE_SK
            }
        )
        
        return res.json(session)
    } catch (error) {
        console.log('FAILED TO CREATE PAYMENT SESION', error)
        res.status(500).json({ success: false, data: ''})
    }
}

export async function stripeWebhook(req, res){
    const sig = req.headers['stripe-signature'];
    //const endpointSecret = "whsec_1a68572ebf6dc02660d8fe4c2844c5c4eeebea4dbfdb7ef6400c21270e7818e5";
    const endpointSecret = "whsec_RnFReTpoF3lqVnkHkyqzUeTIA3FwI64I";
    
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      console.log('EVENT', event)
    } catch (err) {
        console.log('ERROR FROM STRIPE WEBHOOK', err)
        console.log('ERROR FROM STRIPE WEBHOOK PAYLOAD', err?.payload.data)
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

      // Handle the event
  switch (event.type) {
    case 'customer.subscription.created':
      const customerSubscriptionCreated = event.data.object;
      // Then define and call a function to handle the event customer.subscription.created
      console.log('STRIPE SUBSCRIPTION ADDED', customerSubscriptionCreated)
      console.log('STRIPE SUBSCRIPTION ADDED PAYLOAD', customerSubscriptionCreated.payload.data)
      break;
    case 'customer.subscription.deleted':
      const customerSubscriptionDeleted = event.data.object;
      // Then define and call a function to handle the event customer.subscription.deleted
      break;
    case 'customer.subscription.trial_will_end':
      const customerSubscriptionTrialWillEnd = event.data.object;
      // Then define and call a function to handle the event customer.subscription.trial_will_end
      break;
    case 'customer.subscription.updated':
      const customerSubscriptionUpdated = event.data.object;
      // Then define and call a function to handle the event customer.subscription.updated
      console.log('STRIPE SUBSCRIPTION UPDATED', customerSubscriptionUpdated)
      console.log('STRIPE SUBSCRIPTION UPDATED PAYLOAD', customerSubscriptionUpdated.payload.data)
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 res to acknowledge receipt of the event
  res.send();
}