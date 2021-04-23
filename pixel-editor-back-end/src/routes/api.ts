import express from 'express';

import * as apiController from '../controllers/apiController';

const router = express.Router();

router.get('/', apiController.index);

export default router;