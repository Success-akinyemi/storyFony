import { Router } from 'express'
const privateRouter = Router()
import * as controller from '../controllers/privateRoute.js'
import { verifyToken } from '../middleware/auth.js';

//POST ROUTES
privateRouter.route('/create-story').post(verifyToken, controller.createStory);
privateRouter.route('/user/story/handlePrivateStory/:id').post()
privateRouter.route('/user/handleNewStoryDesc').post(verifyToken)

//GET ROUTES
privateRouter.route('/user/stories/:id').get(verifyToken, controller.getUserStories) //get all stories of a user
privateRouter.route('/user/story/:id/:storyId').get(verifyToken, controller.getUserStory) //get particular story of a user
privateRouter.route('/user/story/edit/:id/:storyId').get(verifyToken, controller.getUserStoryEdit) //get particular story of a user to edit



export default privateRouter