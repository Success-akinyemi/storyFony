import { Router } from 'express'
const privateRouter = Router()
import * as controller from '../controllers/privateRoute.js'
import Protect from '../middleware/auth.js';


privateRouter.route('/create-story').post(controller.createStory);

privateRouter.route('/user/stories/:id').get(controller.getUserStories)
privateRouter.route('/user/story/:id/:storyId').get(controller.getUserStory)


export default privateRouter
