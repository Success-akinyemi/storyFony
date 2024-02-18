import { config } from 'dotenv';
config();
import express from 'express'
import router from './routes/auth.js'
import privateRouter from './routes/privateRoute.js'
import subscriptionRouter from './routes/subscriptionRoute.js';
import errorHandler from './middleware/error.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
//import { stripe } from "./utils/stripe.js"
import bodyParser from 'body-parser';

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SK);

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.raw({type: "*/*"}))
app.use(bodyParser.json())




// Replace express.raw with bodyParser.raw
//app.use(bodyParser.raw({ type: 'application/json' }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });

const corsOptions = {
    origin: `${process.env.CLIENT_URL}`,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

/**HTTP get request */
app.get('/', (req, res) => {
    res.status(201).json('Home GET Request')
})

//Import DB
import './config/db.js'
import UserModel from './models/User.js';


app.use('/api', router)
app.use('/api', privateRouter)
app.use('/api/subscription', subscriptionRouter)

//Stripe webhook

app.post('/api/subscription/webhooks', express.raw({type: 'application/json'}), async (request, response) => {
  //const endpointSecret = "whsec_1a68572ebf6dc02660d8fe4c2844c5c4eeebea4dbfdb7ef6400c21270e7818e"
  const endpointSecret = "whsec_RnFReTpoF3lqVnkHkyqzUeTIA3FwI64I";
  const sig = request.headers['stripe-signature'];
  const payload = JSON.stringify(request.body, null, 2);
  //console.log('PAYLOAD', payload, 'PAYLOAD TYPE',typeof payload)
      const header = stripe.webhooks.generateTestHeaderString({
            payload: payload,
            secret: endpointSecret,
    });

  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, header, endpointSecret);
    //console.log('EVENT', event)
} catch (err) {
    //console.log('ERROR FROM STRIPE WEBHOOK', err)
    //console.log('ERROR FROM STRIPE WEBHOOK PAYLOAD', err?.payload.data)
    console.log(`Webhook Error: ${err.message}`)
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'customer.subscription.created':
      const customerSubscriptionCreated = event.data.object;
      // Then define and call a function to handle the event customer.subscription.created
      //console.log('STRIPE SUBSCRIPTION ADDED', customerSubscriptionCreated)
      const currency = customerSubscriptionCreated.currency;
      const startDate = customerSubscriptionCreated.current_period_start;
      const endDate = customerSubscriptionCreated.current_period_end;
      const customer = customerSubscriptionCreated.customer;
      const amount = customerSubscriptionCreated.items.data[0].plan.amount;
      const productId = customerSubscriptionCreated.items.data[0].plan.product;
      const planStatus = customerSubscriptionCreated.items.data[0].plan.active;

      let getPlanName;

      if(amount / 100 === 15){
        getPlanName = 'basic'
      }  
      if(amount / 100 === 25){
        getPlanName = 'standard'
      } 
      if(amount / 100 === 39){
        getPlanName = 'premium'
      }

      let getInkQuantity;
      if(getPlanName === 'basic'){
        getInkQuantity === 4000
      }
      if(getPlanName === 'standard'){
        getInkQuantity === 12000
      }
      if(getPlanName === 'premium'){
        getInkQuantity === 20000
      }
      console.log('SUB CREATED DATAS??', currency, startDate, endDate, customer, amount, productId, planStatus)
      const user = UserModel.findOne({ stripeCustomersId: customer })
      console.log('BEFORE', user)
      user.planId = productId
      user.planStartDate = startDate * 1000
      user.planEndDate = endDate * 1000
      user.planAmount = amount / 100
      user.planCurrency = currency
      user.planStatus = planStatus
      user.planName = getPlanName
      user.totalCreditUsed = 0
      user.totalCreditBalance += getInkQuantity
      await user.save()
      user.totalCredit = user.totalCreditBalance
      await user.save()
      console.log('AFTER', user)
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
      //console.log('STRIPE SUBSCRIPTION UPDATED', customerSubscriptionUpdated)
      //console.log('STRIPE SUBSCRIPTION UPDATED PAYLOAD', customerSubscriptionUpdated.payload.data)
      const subUcurrency = customerSubscriptionUpdated.currency;
      const subUstartDate = customerSubscriptionUpdated.current_period_start;
      const subUendDate = customerSubscriptionUpdated.current_period_end;
      const subUcustomer = customerSubscriptionUpdated.customer;
      const subUamount = customerSubscriptionUpdated.items.data[0].plan.amount;
      const subUproductId = customerSubscriptionUpdated.items.data[0].plan.product;
      const subUplanStatus = customerSubscriptionUpdated.items.data[0].plan.active;

      console.log('SUB UPDATED DATAS??', subUcurrency, subUstartDate, subUendDate, subUcustomer, subUamount, subUproductId, subUplanStatus)
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});


//Error Handler Last piece of middleware
app.use(errorHandler)

const PORT = process.env.PORT || 9001

const server =  app.listen(PORT, () => console.log (`server runing on port http://localhost:${PORT}`))

process.on('unhandledRejection', (err, promise) => {
    console.log(`LOGGED ERROR>>: ${err}`);
    server.close(() => process.exit(1));
})