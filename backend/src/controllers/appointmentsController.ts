import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db.js';

// Helper functions for Supabase queries
async function supabaseQuery(table: string, method: string, data: any = null, filter: any = null) {
  try {
    let query = db.from(table);

    switch (method) {
      case 'insert':
        return await query.insert([data]).select();
      case 'select':
        if (filter) {
          for (const [key, value] of Object.entries(filter)) {
            query = query.eq(key, value);
          }
        }
        return await query.select();
      case 'selectById':
        return await query.eq('id', data).select().single();
      case 'update':
        query = query.eq('id', data.id);
        return await query.update(data).select();
      case 'delete':
        return await query.eq('id', data).delete();
      default:
        throw new Error(`Unknown method: ${method}`);
    }
  } catch (error) {
    console.error(`Supabase error:`, error);
    throw error;
  }
}

export async function createAppointment(req: Request, res: Response) {
  try {
    const {
      client_name,
      client_phone,
      client_email,
      employee_name,
      service_name,
      appointment_date,
      start_time,
      end_time,
      notes,
    } = req.body;

    if (!client_name || !employee_name || !appointment_date || !start_time || !end_time) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: client_name, employee_name, appointment_date, start_time, end_time',
      });
    }

    // Get salon_id from authenticated user (assuming it's in req.user)
    const salon_id = (req.user as any)?.salon_id || 'default-salon';

    const appointmentData = {
      id: uuidv4(),
      salon_id,
      client_name,
      client_phone: client_phone || null,
      client_email: client_email || null,
      employee_name,
      service_name: service_name || null,
      appointment_date,
      start_time,
      end_time,
      notes: notes || null,
      status: 'reserved',
      confirmation_call_made: false,
      reminder_call_sent: false,
      reminder_call_attempts: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const result = await supabaseQuery('appointments', 'insert', appointmentData);

    if (result.error) {
      return res.status(400).json({
        success: false,
        error: result.error.message,
      });
    }

    res.status(201).json({
      success: true,
      data: result.data?.[0] || appointmentData,
      message: 'Appointment created successfully',
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ success: false, error: 'Failed to create appointment' });
  }
}

export async function getAppointments(req: Request, res: Response) {
  try {
    const { date, employee_name, status } = req.query;

    let query = db.from('appointments').select('*');

    if (date) {
      query = query.eq('appointment_date', date as string);
    }

    if (employee_name) {
      query = query.eq('employee_name', employee_name as string);
    }

    if (status) {
      query = query.eq('status', status as string);
    }

    const { data, error } = await query.select().order('appointment_date', { ascending: true }).order('start_time', { ascending: true });

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    const mapped = (data || []).map((apt: any) => ({
      ...apt,
      client_name: `${apt.name} ${apt.last_name}`.trim(),
      employee_name: apt.professional,
      status: apt.status || 'reserved'
    }));

    res.json({
      success: true,
      data: mapped,
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch appointments' });
  }
}

export async function getAppointmentById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const { data, error } = await db.from('appointments').eq('id', id).select().single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found',
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch appointment' });
  }
}

export async function updateAppointment(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updates = {
      ...req.body,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await db
      .from('appointments')
      .eq('id', id)
      .update(updates)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found',
      });
    }

    res.json({
      success: true,
      data,
      message: 'Appointment updated successfully',
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ success: false, error: 'Failed to update appointment' });
  }
}

export async function deleteAppointment(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const { error } = await db.from('appointments').eq('id', id).delete();

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    res.json({
      success: true,
      message: 'Appointment deleted successfully',
    });
  } catch (error) {
    console.error('Delete appointment error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete appointment' });
  }
}

export async function getAvailableSlots(req: Request, res: Response) {
  try {
    const { date, employee_name, duration = 30 } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        error: 'Date parameter is required',
      });
    }

    const salon_id = (req.user as any)?.salon_id || 'default-salon';

    // Get all appointments for this date
    const { data: appointments, error } = await db
      .from('appointments')
      .eq('salon_id', salon_id)
      .eq('appointment_date', date as string)
      .eq('status', 'reserved')
      .select();

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    // Generate available slots (8 AM - 7 PM, 30-minute slots)
    const slots = [];
    const start = 8; // 8 AM
    const end = 19; // 7 PM
    const slotDuration = parseInt(duration as string) || 30;

    for (let hour = start; hour < end; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        const endHour = Math.floor((hour * 60 + minute + slotDuration) / 60);
        const endMin = (hour * 60 + minute + slotDuration) % 60;
        const endTimeStr = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;

        // Check if this slot is available
        const isAvailable = !appointments?.some((apt: any) => {
          const aptStart = apt.start_time;
          const aptEnd = apt.end_time;
          // Check for overlap
          return timeStr < aptEnd && endTimeStr > aptStart;
        });

        if (isAvailable) {
          slots.push({
            time: timeStr,
            endTime: endTimeStr,
            available: true,
          });
        }
      }
    }

    res.json({
      success: true,
      data: slots,
    });
  } catch (error) {
    console.error('Get available slots error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch available slots' });
  }
}

export async function markConfirmationCallMade(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const { data, error } = await db
      .from('appointments')
      .eq('id', id)
      .update({
        confirmation_call_made: true,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found',
      });
    }

    res.json({
      success: true,
      data,
      message: 'Confirmation call marked as made',
    });
  } catch (error) {
    console.error('Mark confirmation call error:', error);
    res.status(500).json({ success: false, error: 'Failed to mark confirmation call' });
  }
}

export async function markReminderSent(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const { data, error } = await db
      .from('appointments')
      .eq('id', id)
      .update({
        reminder_call_sent: true,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found',
      });
    }

    res.json({
      success: true,
      data,
      message: 'Reminder marked as sent',
    });
  } catch (error) {
    console.error('Mark reminder sent error:', error);
    res.status(500).json({ success: false, error: 'Failed to mark reminder' });
  }
}

export async function recordReminderAttempt(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Get current attempt count
    const { data: appointment, error: getError } = await db
      .from('appointments')
      .eq('id', id)
      .select('reminder_call_attempts')
      .single();

    if (getError || !appointment) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found',
      });
    }

    const { data, error } = await db
      .from('appointments')
      .eq('id', id)
      .update({
        reminder_call_attempts: (appointment.reminder_call_attempts || 0) + 1,
        last_reminder_attempt: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    res.json({
      success: true,
      data,
      message: 'Reminder attempt recorded',
    });
  } catch (error) {
    console.error('Record reminder attempt error:', error);
    res.status(500).json({ success: false, error: 'Failed to record reminder attempt' });
  }
}
