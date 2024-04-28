import { Router } from 'express'
const adminRouter = Router()
import * as controller from '../controllers/adminRoutes.js'
import { verifyAdminToken, verifyToken, verifyTokenAndAdmin, verifyTokenAndGrandAdmin } from '../middleware/auth.js';

//admin login
adminRouter.route('/admin/login').post(verifyToken, controller.login)
adminRouter.route('/admin/makeAdmin').post(verifyToken, verifyAdminToken, verifyTokenAndAdmin, controller.makeAdmin)
adminRouter.route('/admin/removeAdmin').post(verifyToken, verifyAdminToken, verifyTokenAndAdmin, verifyTokenAndGrandAdmin, controller.removeAdmin)



//GET
adminRouter.route('/admin/getAllSubscriptions').get(verifyToken, verifyAdminToken, controller.getAllsubscriptions)
adminRouter.route('/admin/getUsers').get(verifyToken, verifyAdminToken, controller.getUsers)
adminRouter.route('/admin/getUser/:id').get(verifyToken, verifyAdminToken, controller.getUser)
adminRouter.route('/admin/getStories').get(verifyToken, verifyAdminToken, controller.getStories)






export default adminRouter
