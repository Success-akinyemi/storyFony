import { Router } from 'express'
const privateRouter = Router()
import * as controller from '../controllers/privateRoute.js'
import Protect from '../middleware/auth.js';


privateRouter.route('/').get(Protect, controller.getPrivateData);



export default privateRouter
