import { Router } from 'express';
import { dsaController } from '../controllers/dsa.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { dsaImportSchema, dsaUpdateSchema } from '../validators/dsa.validator.js';

const router = Router();

// Public platform overview & lists
router.get('/platforms', dsaController.getPlatforms);
router.get('/leetcode', dsaController.getLeetcode);
router.get('/codeforces', dsaController.getCodeforces);
router.get('/problems/:platform/:slug', dsaController.getProblemDetail);

// Problem solution records import & update
router.post('/import/preview', dsaController.previewImport);
router.post('/import', validateRequest(dsaImportSchema), dsaController.importProblems);
router.patch('/problems/:platform/:slug', validateRequest(dsaUpdateSchema), dsaController.updateProblem);

// Automated scheduler cron webhook & telemetry
router.post('/sync/cron', dsaController.triggerCronSync);
router.get('/sync/status', dsaController.getSyncStatus);

// Manual platform sync
router.post('/sync/:platform', dsaController.syncPlatform);

export default router;
