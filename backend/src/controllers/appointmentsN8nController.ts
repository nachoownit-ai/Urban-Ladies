import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { supabaseQuery } from '../db.js';

export async function checkAvailability(req: Request, res: Response) {
  try {
    const { service, date, start_time, end_time, professional } = req.query;

    if (!service || !date || !start_time || !end_time) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: service, date, start_time, end_time',
      });
    }

    const { data: appointments, error } = await supabaseQuery('appointments', 'GET', undefined, {
      appointment_date: `eq.${date}`,
      service: `eq.${service}`,
      status: 'eq.active',
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: `Database error: ${error.message}`,
      });
    }

    let relevantAppointments = appointments || [];
    if (professional) {
      relevantAppointments = relevantAppointments.filter(
        (apt: any) => apt.professional === professional
      );
    }

    const hasConflict = relevantAppointments.some((apt: any) => {
      const appointmentStart = apt.start_time;
      const appointmentEnd = apt.end_time;
      const queryStart = start_time as string;
      const queryEnd = end_time as string;
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

    if (!name || !last_name || !phone || !service || !appointment_date || !start_time || !end_time) {
      return res.status(400).json({
        success: false,
        message:
          'Missing required fields: name, last_name, phone, service, appointment_date, start_time, end_time',
      });
    }

    const { data: conflictingAppointments, error: checkError } = await supabaseQuery(
      'appointments',
      'GET',
      undefined,
      {
        appointment_date: `eq.${appointment_date}`,
        service: `eq.${service}`,
        status: 'eq.active',
      }
    );

    if (checkError) {
      return res.status(400).json({
        success: false,
        message: `Error checking conflicts: ${checkError.message}`,
      });
    }

    const hasConflict = (conflictingAppointments || []).some((apt: any) => {
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

    const { data, error } = await supabaseQuery('appointments', 'POST', appointmentData);

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

export async function cancelAppointment(req: Request, res: Response) {
  try {
    const { name, last_name, phone, appointment_date, start_time, end_time } = req.body;

    if (!name || !last_name || !phone || !appointment_date || !start_time || !end_time) {
      return res.status(400).json({
        success: false,
        message:
          'Missing required fields: name, last_name, phone, appointment_date, start_time, end_time',
      });
    }

    const { data: appointments, error: findError } = await supabaseQuery('appointments', 'GET', undefined, {
      name: `eq.${name}`,
      last_name: `eq.${last_name}`,
      phone: `eq.${phone}`,
      appointment_date: `eq.${appointment_date}`,
      start_time: `eq.${start_time}`,
      end_time: `eq.${end_time}`,
      status: 'eq.active',
    });

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

    const { error: updateError } = await supabaseQuery('appointments', 'PATCH', {
      status: 'cancelled',
      updated_at: new Date().toISOString(),
    }, {
      id: `eq.${appointmentToCancel.id}`,
    });

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
