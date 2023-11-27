import { Router } from 'express'
const privateRouter = Router()
import * as controller from '../controllers/privateRoute.js'
import Protect from '../middleware/auth.js';


privateRouter.route('/create-story').post(Protect, controller.createStory);



export default privateRouter
