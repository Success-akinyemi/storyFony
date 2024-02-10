import { Router } from 'express'
const privateRouter = Router()
import * as controller from '../controllers/privateRoute.js'
import { verifyToken } from '../middleware/auth.js';

//POST ROUTES
privateRouter.route('/create-story').post(verifyToken, controller.createStory);
privateRouter.route('/user/story/handlePrivateStory').post(verifyToken, controller.handlePrivateStory) //Toggle wheather story is public or private
privateRouter.route('/user/story/handlePublishedToCommunity').post(verifyToken, controller.handlePublishedToCommunity) //Toggle wheather story is public or private
privateRouter.route('/user/story/handleNewStoryDesc').post(verifyToken, controller.generateNewStoryDesc) // generate new description for a user story with ai
privateRouter.route('/user/story/saveDesc').post(verifyToken, controller.saveStoryDesc) //Save story description edited by user 
privateRouter.route('/user/story/recreateStory').post(verifyToken, controller.recreateStory ) // recreate an aleady existing story for a user
privateRouter.route('/user/story/rewriteChapter').post(verifyToken, controller.rewriteChapter ) // recreate an aleady existing chapter of a story for a user
privateRouter.route('/user/story/generateChapterImage').post(verifyToken, controller.generateChapterImage ) // generate chapter image for each chapter of a story
privateRouter.route('/user/story/updateStoryChapterContent').post(verifyToken, controller.updateStoryChapterContent) //update chapter route
privateRouter.route('/user/story/generateCoverStoryImage').post(verifyToken, controller.generateCoverStoryImage) //generate new cover image for story with AI
privateRouter.route('/user/story/uploadCoverImg').post(verifyToken, controller.uploadCoverImg) //save new story cover image upoaded by user
privateRouter.route('/user/story/addNewChapters').post(verifyToken, controller.addNewChapters) //add new chapters to a story
privateRouter.route('/user/story/likeStory').post(verifyToken, controller.likeStory) //Like a story
privateRouter.route('/user/story/generateAiDesc').post(verifyToken, controller.generateAiDesc) //generate a story decsription for a user using AI



//GET ROUTES
privateRouter.route('/user/stories/:id').get(verifyToken, controller.getUserStories) //get all stories of a user
privateRouter.route('/user/likedStories/:id').get(verifyToken, controller.getLikedUserStories) //get all stories liked by a user
privateRouter.route('/user/story/:id/:storyId').get(verifyToken, controller.getUserStory) //get particular story of a user
privateRouter.route('/user/story/edit/:id/:storyId').get(verifyToken, controller.getUserStoryEdit) //get particular story of a user to edit



export default privateRouter