import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../db.js';

/**
 * Check availability for a given date, time, service, and optional professional
 * GET /api/n8n/check-availability?service=Corte&date=2026-05-30&start_time=10:00&end_time=10:45&professional=Rubi
 */
export async function checkAvailability(req: Request, res: Response) {
  try {
    const { service, date, start_time, end_time, professional } = req.query;

    // Validate required parameters
    if (!service || !date || !start_time || !end_time) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: service, date, start_time, end_time',
      });
    }

    // Query appointments table for conflicts
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('appointment_date', date as string)
      .eq('service', service as string)
      .eq('status', 'active');

    if (error) {
      return res.status(400).json({
        success: false,
        message: `Database error: ${error.message}`,
      });
    }

    // Filter by professional if provided
    let relevantAppointments = appointments || [];
    if (professional) {
      relevantAppointments = relevantAppointments.filter(
        (apt) => apt.professional === professional
      );
    }

    // Check for time conflicts
    const hasConflict = relevantAppointments.some((apt) => {
      const appointmentStart = apt.start_time;
      const appointmentEnd = apt.end_time;
      const queryStart = start_time as string;
      const queryEnd = end_time as string;

      // Check if times overlap
      return queryStart < appointmentEnd && queryEnd > appointmentStart;
    });

    res.json({
      success: true,
      available: !hasConflict,
      message: hasConflict
        ? `No disponible: conflicto de horario para ${service} el ${date}`
        : `Disponible: ${service} el ${date} de ${start_time} a ${end_time}`,
      data: {
        service,
        date,
        start_time,
        end_time,
        professional: professional || 'any',
        available: !hasConflict,
        conflicts: relevantAppointments.length,
      },
    });
  } catch (error: any) {
    console.error('Check availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking availability',
      error: error.message,
    });
  }
}

/**
 * Create a new appointment
 * POST /api/n8n/create-appointment
 * Body: { name, last_name, phone, service, date, start_time, end_time, professional (optional) }
 */
export async function createAppointment(req: Request, res: Response) {
  try {
    const {
      name,
      last_name,
      phone,
      service,
      appointment_date,
      start_time,
      end_time,
      professional,
      notes,
    } = req.body;

    // Validate required fields
    if (!name || !last_name || !phone || !service || !appointment_date || !start_time || !end_time) {
      return res.status(400).json({
        success: false,
        message:
          'Missing required fields: name, last_name, phone, service, appointment_date, start_time, end_time',
      });
    }

    // Check availability before creating
    const { data: conflictingAppointments, error: checkError } = await supabase
      .from('appointments')
      .select('*')
      .eq('appointment_date', appointment_date)
      .eq('service', service)
      .eq('status', 'active');

    if (checkError) {
      return res.status(400).json({
        success: false,
        message: `Error checking conflicts: ${checkError.message}`,
      });
    }

    // Check for time conflicts
    const hasConflict = (conflictingAppointments || []).some((apt) => {
      const apptStart = apt.start_time;
      const apptEnd = apt.end_time;
      return start_time < apptEnd && end_time > apptStart;
    });

    if (hasConflict) {
      return res.status(409).json({
        success: false,
        message: `El horario ${start_time}-${end_time} ya está reservado para ${service} el ${appointment_date}`,
      });
    }

    // Create the appointment
    const appointmentData = {
      id: uuidv4(),
      name,
      last_name,
      phone,
      service,
      professional: professional || null,
      appointment_date,
      start_time,
      end_time,
      status: 'active',
      notes: notes || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('appointments')
      .insert([appointmentData])
      .select();

    if (error) {
      return res.status(400).json({
        success: false,
        message: `Error creating appointment: ${error.message}`,
      });
    }

    res.status(201).json({
      success: true,
      message: `Reserva creada exitosamente para ${name} ${last_name}`,
      data: {
        appointment_id: appointmentData.id,
        client_name: `${name} ${last_name}`,
        phone,
        service,
        date: appointment_date,
        time: `${start_time}-${end_time}`,
        professional: professional || 'sin asignar',
      },
    });
  } catch (error: any) {
    console.error('Create appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating appointment',
      error: error.message,
    });
  }
}

/**
 * Cancel an appointment
 * POST /api/n8n/cancel-appointment
 * Body: { name, last_name, phone, date, start_time, end_time }
 */
export async function cancelAppointment(req: Request, res: Response) {
  try {
    const { name, last_name, phone, appointment_date, start_time, end_time } = req.body;

    // Validate required fields
    if (!name || !last_name || !phone || !appointment_date || !start_time || !end_time) {
      return res.status(400).json({
        success: false,
        message:
          'Missing required fields: name, last_name, phone, appointment_date, start_time, end_time',
      });
    }

    // Find the appointment to cancel
    const { data: appointments, error: findError } = await supabase
      .from('appointments')
      .select('*')
      .eq('name', name)
      .eq('last_name', last_name)
      .eq('phone', phone)
      .eq('appointment_date', appointment_date)
      .eq('start_time', start_time)
      .eq('end_time', end_time)
      .eq('status', 'active');

    if (findError) {
      return res.status(400).json({
        success: false,
        message: `Error searching appointment: ${findError.message}`,
      });
    }

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No se encontró cita para ${name} ${last_name} el ${appointment_date} de ${start_time} a ${end_time}`,
      });
    }

    const appointmentToCancel = appointments[0];

    // Cancel the appointment (set status to cancelled)
    const { error: updateError } = await supabase
      .from('appointments')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('id', appointmentToCancel.id);

    if (updateError) {
      return res.status(400).json({
        success: false,
        message: `Error cancelling appointment: ${updateError.message}`,
      });
    }

    res.json({
      success: true,
      message: `Reserva cancelada para ${name} ${last_name}`,
      data: {
        appointment_id: appointmentToCancel.id,
        client_name: `${name} ${last_name}`,
        phone,
        service: appointmentToCancel.service,
        date: appointment_date,
        time: `${start_time}-${end_time}`,
        status: 'cancelled',
      },
    });
  } catch (error: any) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling appointment',
      error: error.message,
    });
  }
}
