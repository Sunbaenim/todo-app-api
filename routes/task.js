import express from 'express';
import { createTask, getAllTasks, getTaskById, updateTask, deleteTask } from '../controllers/task.js';

const router = express.Router();

router.post('/task', createTask);
router.get('/task', getAllTasks);
router.get('/task/:id', getTaskById);
router.put('/task/:id', updateTask)
router.delete('/task/:id', deleteTask);

export default router;