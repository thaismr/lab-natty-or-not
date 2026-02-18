const { getPool } = require("../db");

module.exports = async function (context, req) {
  context.log("getServices function processed a request.");
  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .query(
        "SELECT ServiceId, Name, Description, DurationMinutes, Price FROM Services",
      );
    context.res = {
      status: 200,
      body: result.recordset,
    };
  } catch (err) {
    context.log.error("Error in getServices:", err);
    context.res = {
      status: 500,
      body: { error: "Failed to fetch services" },
    };
  }
};
