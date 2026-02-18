const sql = require("mssql");

let pool;

// Local mock data for development without Azure
const mockServices = [
  {
    ServiceId: 1,
    Name: "Consulta Geral",
    Description: "Atendimento médico geral",
    DurationMinutes: 30,
    Price: 150.0,
  },
  {
    ServiceId: 2,
    Name: "Exame de Sangue",
    Description: "Análise de sangue completa",
    DurationMinutes: 15,
    Price: 80.0,
  },
  {
    ServiceId: 3,
    Name: "Check-up",
    Description: "Avaliação geral de saúde",
    DurationMinutes: 60,
    Price: 300.0,
  },
];

const mockAppointments = [
  {
    AppointmentId: 1,
    ServiceId: 1,
    ClientName: "João Silva",
    AppointmentDate: "2024-01-15T10:00:00Z",
    Status: "confirmed",
  },
];

async function getPool() {
  // Check if running locally without database credentials
  if (!process.env.DB_SERVER || process.env.LOCAL_MODE === "true") {
    // Return mock pool for local development
    return {
      request: () => ({
        query: (sql) => {
          if (sql.includes("FROM Services")) {
            return Promise.resolve({ recordset: mockServices });
          }
          if (sql.includes("FROM Appointments")) {
            return Promise.resolve({ recordset: mockAppointments });
          }
          if (sql.includes("INSERT INTO Appointments")) {
            return Promise.resolve({ recordset: [{ AppointmentId: 999 }] });
          }
          return Promise.resolve({ recordset: [] });
        },
      }),
    };
  }

  if (pool) return pool;
  const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
      encrypt: true,
      trustServerCertificate: true,
    },
  };
  pool = await sql.connect(config);
  return pool;
}

module.exports = { getPool };
