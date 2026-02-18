// Health check function for Azure Functions
// Used by Application Insights and Azure health checks

const { getPool } = require("../db");

module.exports = async function (context, req) {
  context.log("Health check invoked.");

  const health = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    checks: {},
  };

  try {
    // Check database connectivity
    try {
      const pool = await getPool();
      // For mock pool, we just verify it returns something
      if (pool && pool.request) {
        health.checks.database = "connected";
      } else if (process.env.LOCAL_MODE === "true") {
        health.checks.database = "mock-mode";
      } else {
        throw new Error("Database not available");
      }
    } catch (dbErr) {
      health.checks.database = "disconnected";
      health.status = "degraded";
    }

    // Check OpenAI API (if configured)
    if (process.env.OPENAI_API_KEY) {
      health.checks.openai = "configured";
    } else {
      health.checks.openai = "not-configured";
    }

    // Set response status based on health
    const statusCode = health.status === "healthy" ? 200 : 503;

    context.res = {
      status: statusCode,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
      body: health,
    };
  } catch (err) {
    context.log.error("Health check failed:", err);
    context.res = {
      status: 503,
      body: {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: err.message,
      },
    };
  }
};
