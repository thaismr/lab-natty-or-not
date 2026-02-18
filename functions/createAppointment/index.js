const { getPool } = require("../db");
const { checkAuthenticatedUser, rateLimit } = require("../utils");

module.exports = async function (context, req) {
  context.log("createAppointment function invoked.");

  if (!checkAuthenticatedUser(req)) {
    context.res = {
      status: 401,
      body: { error: "Authentication required" },
    };
    return;
  }

  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const count = rateLimit(ip);
  if (count > parseInt(process.env.APPT_RATE_LIMIT || "50")) {
    context.res = { status: 429, body: { error: "Rate limit exceeded" } };
    return;
  }

  const { patientId, serviceId, scheduledAt } = req.body || {};
  if (!patientId || !serviceId || !scheduledAt) {
    context.res = {
      status: 400,
      body: { error: "patientId, serviceId and scheduledAt required" },
    };
    return;
  }

  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("patientId", patientId)
      .input("serviceId", serviceId)
      .input("scheduledAt", scheduledAt)
      .query(
        "INSERT INTO Appointments (PatientId, ServiceId, ScheduledAt) VALUES (@patientId, @serviceId, @scheduledAt); SELECT SCOPE_IDENTITY() as id;",
      );
    context.res = {
      status: 201,
      body: { appointmentId: result.recordset[0].id },
    };
  } catch (err) {
    context.log.error("Error creating appointment", err);
    context.res = {
      status: 500,
      body: { error: "Failed to create appointment" },
    };
  }
};
