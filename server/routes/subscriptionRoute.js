import { Router } from 'express'
import * as controller from '../controllers/subscriptionRoute.js'

const subscriptionRouter = Router();

subscriptionRouter.route('/prices').get(controller.getPrices);

export default subscriptionRouter