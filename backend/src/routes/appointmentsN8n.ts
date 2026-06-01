import { Router } from 'express';
import {
  checkAvailability,
  createAppointment,
  cancelAppointment,
} from '../controllers/appointmentsN8nController.js';

const router = Router();

/**
 * N8N Endpoints - No authentication required (called directly from N8N agents)
 */

// Check availability
router.get('/check-availability', checkAvailability);

// Create appointment
router.post('/create-appointment', createAppointment);

// Cancel appointment
router.post('/cancel-appointment', cancelAppointment);

export default router;
