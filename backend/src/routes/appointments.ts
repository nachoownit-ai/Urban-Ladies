import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  getAvailableSlots,
  markConfirmationCallMade,
  markReminderSent,
  recordReminderAttempt,
} from '../controllers/appointmentsController.js';

const router = Router();

// All routes are protected with authentication
router.use(authMiddleware);

// CRUD Operations
router.post('/', createAppointment);
router.get('/', getAppointments);
router.get('/available-slots', getAvailableSlots);
router.get('/:id', getAppointmentById);
router.put('/:id', updateAppointment);
router.delete('/:id', deleteAppointment);

// Special endpoints for N8N
router.post('/:id/confirm-call', markConfirmationCallMade);
router.post('/:id/send-reminder', markReminderSent);
router.post('/:id/reminder-attempt', recordReminderAttempt);

export default router;
