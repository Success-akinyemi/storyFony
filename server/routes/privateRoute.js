import { Router } from 'express'
const privateRouter = Router()
import * as controller from '../controllers/privateRoute.js'
import { verifyApiKey, verifyToken } from '../middleware/auth.js';
import { expiredSub, premiumSub } from '../middleware/verifySubscription.js';

//POST ROUTES
privateRouter.route('/create-story').post(verifyToken, verifyApiKey, controller.createStory);
privateRouter.route('/continue-writing').post(verifyToken, verifyApiKey, controller.continueWriting);
privateRouter.route('/repharseWords').post(verifyToken, verifyApiKey, controller.repharseWords);
privateRouter.route('/user/story/handlePrivateStory').post(verifyToken, controller.handlePrivateStory) //Toggle wheather story is public or private
privateRouter.route('/user/story/handlePublishedToCommunity').post(verifyToken, controller.handlePublishedToCommunity) //Toggle wheather story is public or private
privateRouter.route('/user/story/handleNewStoryDesc').post(verifyToken, verifyApiKey, controller.generateNewStoryDesc) // generate new description for a user story with ai
privateRouter.route('/user/story/saveDesc').post(verifyToken, controller.saveStoryDesc) //Save story description edited by user 
privateRouter.route('/user/story/delete').post(verifyToken, controller.deleteStory) //delete user story
privateRouter.route('/user/story/recreateStory').post(verifyToken, verifyApiKey, controller.recreateStory ) // recreate an aleady existing story for a user
privateRouter.route('/user/story/rewriteChapter').post(verifyToken, verifyApiKey, controller.rewriteChapter ) // recreate an aleady existing chapter of a story for a user
privateRouter.route('/user/story/generateChapterImage').post(verifyToken, verifyApiKey, controller.generateChapterImage ) // generate chapter image for each chapter of a story
privateRouter.route('/user/story/updateStoryChapterContent').post(verifyToken, controller.updateStoryChapterContent) //update chapter route
privateRouter.route('/user/story/generateCoverStoryImage').post(verifyToken, verifyApiKey, controller.generateCoverStoryImage) //generate new cover image for story with AI
privateRouter.route('/user/story/uploadCoverImg').post(verifyToken, controller.uploadCoverImg) //save new story cover image upoaded by user
privateRouter.route('/user/story/addNewChapters').post(verifyToken, verifyApiKey, controller.addNewChapters) //add new chapters to a story
privateRouter.route('/user/story/likeStory').post(verifyToken, controller.likeStory) //Like a story
privateRouter.route('/user/story/generateAiDesc').post(verifyToken, verifyApiKey, controller.generateAiDesc) //generate a story decsription for a user using AI
privateRouter.route('/user/story/generatePdf').post(verifyToken, controller.generatePdf) //generate a story Pdf for the user
privateRouter.route('/user/story/generateTranscipt').post(verifyToken, verifyApiKey, controller.generateAudio) //generate audio file for story
privateRouter.route('/user/story/synonymWord').post(verifyToken, verifyApiKey, controller.synonymWord) //find a synonym Word



//GET ROUTES
privateRouter.route('/user/stories/:id').get(verifyToken, controller.getUserStories) //get all stories of a user
privateRouter.route('/user/likedStories/:id').get(verifyToken, controller.getLikedUserStories) //get all stories liked by a user
privateRouter.route('/user/story/:id/:storyId').get(verifyToken, controller.getUserStory) //get particular story of a user
privateRouter.route('/user/story/edit/:id/:storyId').get(verifyToken, controller.getUserStoryEdit) //get particular story of a user to edit
privateRouter.route('/user/story/public').get(verifyToken, controller.getPublicStories) //get all public stories 



export default privateRouter