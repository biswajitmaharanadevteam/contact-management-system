import { Router } from 'express';
import { contactController } from '../controllers/contactController.js';

const router = Router();

// Statistics endpoint
router.get('/stats', contactController.getStats);

// CSV Export
router.get('/export/csv', contactController.exportCsv);

// Bulk Import
router.post('/bulk-import', contactController.bulkImport);

// Database Inspection & Live SQL Viewer
router.get('/database/inspect', contactController.inspectDatabase);
router.post('/database/query', contactController.runQuery);
router.post('/database/reset', contactController.resetDatabase);
router.get('/database/download', contactController.downloadDatabase);


// Contact collection endpoints
router.get('/', contactController.getAll);
router.post('/', contactController.create);

// Individual contact endpoints
router.get('/:id', contactController.getById);
router.put('/:id', contactController.update);
router.patch('/:id/favorite', contactController.toggleFavorite);
router.delete('/:id', contactController.delete);

export default router;
