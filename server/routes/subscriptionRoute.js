import { Router } from 'express'
import * as controller from '../controllers/subscriptionRoute.js'
import express from "express"
import bodyParser from 'body-parser';
const app = express()

const subscriptionRouter = Router();

subscriptionRouter.route('/prices').get(controller.getPrices); //get prices from stripe dashboard
subscriptionRouter.route('/paymentSession').post(controller.paymentSession)
subscriptionRouter.route('/subHistroy/:id').get(controller.getHistroy)//get a user subscription histroy

//subscriptionRouter.route('/webhooks', express.raw({type: 'application/json'}), ).post(controller.stripeWebhook)


export default subscriptionRouter