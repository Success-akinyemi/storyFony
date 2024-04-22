import { Router } from 'express'
import * as controller from '../controllers/apiKey.js'
import { verifyToken } from '../middleware/auth.js';

const router = Router();
router.route('/apikey/newKey').post(controller.newApiKey)

router.route('/apikey/deleteKey').post(controller.deleteApikey)

router.route('/apikey/getKey/:id').get(controller.getApiKey)





export default router