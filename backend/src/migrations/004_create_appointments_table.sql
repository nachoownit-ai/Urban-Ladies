-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
  client_name VARCHAR(255) NOT NULL,
  client_phone VARCHAR(20),
  client_email VARCHAR(255),
  employee_name VARCHAR(100) NOT NULL,
  service_name VARCHAR(255),
  appointment_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status VARCHAR(50) DEFAULT 'reserved' CHECK (status IN ('reserved', 'completed', 'cancelled')),
  notes TEXT,
  confirmation_call_made BOOLEAN DEFAULT FALSE,
  reminder_call_sent BOOLEAN DEFAULT FALSE,
  reminder_call_attempts INT DEFAULT 0,
  last_reminder_attempt TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_appointments_salon_id ON appointments(salon_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_employee ON appointments(employee_name);

-- Create updated_at trigger to auto-update timestamp
CREATE OR REPLACE FUNCTION update_appointments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS appointments_updated_at_trigger ON appointments;
CREATE TRIGGER appointments_updated_at_trigger
BEFORE UPDATE ON appointments
FOR EACH ROW
EXECUTE FUNCTION update_appointments_updated_at();
