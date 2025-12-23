import { Pool } from 'pg';
import { config } from './environment';

const pool = new Pool({
  connectionString: config.database.url,
  ssl: {
    rejectUnauthorized: false // Required for Render Postgres
  }
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

const createTablesQuery = `
  -- Create Clinics table
  CREATE TABLE IF NOT EXISTS clinics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    address VARCHAR(500),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Create Doctors table
  CREATE TABLE IF NOT EXISTS doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    specialization VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Create Patients table
  CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Create Slots table
  CREATE TABLE IF NOT EXISTS slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status VARCHAR(50) DEFAULT 'AVAILABLE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Create Appointments table
  CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    slot_id UUID NOT NULL REFERENCES slots(id) ON DELETE CASCADE,
    symptoms TEXT,
    triage_level VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'CONFIRMED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  
  -- Add indexes (checking if they exist first to avoid errors is hard in pure SQL, 
  -- so we just ignore errors if they fail, or you can run this once)
`;

export async function initializeDatabase() {
  try {
    const client = await pool.connect();
    console.log('✅ Database connected successfully');
    
    // RUN THE TABLE CREATION SCRIPT
    console.log('🛠️ Checking/Creating tables...');
    await client.query(createTablesQuery);
    console.log('✅ Tables created/verified successfully');

    client.release();
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(-1);
  }
}

export default pool;