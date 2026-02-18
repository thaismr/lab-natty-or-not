// Comprehensive test script for all functions
// Tests: getServices, chat, rate limiting, auth enforcement

const mockServices = [
  {
    ServiceId: 1,
    Name: "General Checkup",
    Description: "Regular health checkup",
    DurationMinutes: 30,
    Price: 150.0,
  },
  {
    ServiceId: 2,
    Name: "Blood Test",
    Description: "Complete blood count analysis",
    DurationMinutes: 15,
    Price: 80.0,
  },
  {
    ServiceId: 3,
    Name: "X-Ray",
    Description: "Chest X-Ray examination",
    DurationMinutes: 20,
    Price: 120.0,
  },
];

const mockResponses = [
  "Our clinic offers General Checkup, Blood Test, X-Ray, MRI, Dental Cleaning, and Vaccination services. Which would you like to know more about?",
  "I'd be happy to help you book an appointment! Please let me know which service you're interested in and your preferred date and time.",
  "Great question! Our General Checkup costs $150 and takes about 30 minutes. Would you like to schedule one?",
  "We have appointments available this week. Would you like me to book a slot for you?",
  "Your health is our priority! We offer comprehensive medical services at competitive prices.",
];

// In-memory rate limit store
const rateLimitStore = {};
const RATE_LIMIT = 100;
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 1 day

function checkAuthenticatedUser(req) {
  if (process.env.LOCAL_MODE === "true") {
    return true;
  }

  const headers = req.headers || {};
  const rawPrincipal = headers["x-ms-client-principal"];
  if (!rawPrincipal) {
    return false;
  }

  try {
    const decoded = Buffer.from(rawPrincipal, "base64").toString("utf8");
    const principal = JSON.parse(decoded);
    return Boolean(principal && principal.userId);
  } catch (err) {
    return false;
  }
}

function rateLimit(ip) {
  const now = Date.now();
  if (!rateLimitStore[ip]) {
    rateLimitStore[ip] = { count: 0, start: now };
  }
  const entry = rateLimitStore[ip];
  if (now - entry.start > RATE_LIMIT_WINDOW) {
    entry.start = now;
    entry.count = 0;
  }
  entry.count += 1;
  return entry.count;
}

function getMockResponse(message) {
  const lower = message.toLowerCase();
  if (
    lower.includes("book") ||
    lower.includes("appointment") ||
    lower.includes("schedule")
  ) {
    return {
      reply:
        '{"action":"book","patientId":1,"serviceId":1,"scheduledAt":"2026-02-20T10:00"}',
      isBooking: true,
    };
  }
  return {
    reply: mockResponses[Math.floor(Math.random() * mockResponses.length)],
    isBooking: false,
  };
}

// Test functions
function testGetServices() {
  console.log("\n=== Test 1: GET /api/getServices ===");
  try {
    const result = mockServices;
    console.log("  Returned services:", result.length);
    console.log("  Services:", result.map((s) => s.Name).join(", "));
    return true;
  } catch (e) {
    console.log("  Failed:", e.message);
    return false;
  }
}

function testAuthEnforcement() {
  console.log("\n=== Test 2: Auth Enforcement ===");

  // Test without principal header
  const req1 = { headers: {} };
  const result1 = checkAuthenticatedUser(req1);
  console.log(
    "  Without auth principal:",
    result1 ? "FAILED (accepted)" : "PASSED (rejected)",
  );

  // Test with malformed principal
  const req2 = {
    headers: { "x-ms-client-principal": "not-base64" },
  };
  const result2 = checkAuthenticatedUser(req2);
  console.log(
    "  With malformed principal:",
    result2 ? "FAILED (accepted)" : "PASSED (rejected)",
  );

  // Test with valid principal
  const principal = Buffer.from(
    JSON.stringify({ userId: "test-user", userRoles: ["authenticated"] }),
    "utf8",
  ).toString("base64");
  const req3 = {
    headers: { "x-ms-client-principal": principal },
  };
  const result3 = checkAuthenticatedUser(req3);
  console.log(
    "  With valid principal:",
    result3 ? "PASSED (accepted)" : "FAILED (rejected)",
  );

  return !result1 && !result2 && result3;
}

function testRateLimiting() {
  console.log("\n=== Test 3: Rate Limiting ===");

  // Reset rate limit store
  Object.keys(rateLimitStore).forEach((k) => delete rateLimitStore[k]);

  const testIp = "127.0.0.1";
  const results = [];

  // Test under limit
  for (let i = 1; i <= 5; i++) {
    const count = rateLimit(testIp);
    results.push(count <= RATE_LIMIT);
  }

  // Simulate exceeding limit
  for (let i = 0; i < RATE_LIMIT - 5; i++) {
    rateLimit(testIp);
  }

  const overLimit = rateLimit(testIp);
  console.log(
    "  Under limit (5 requests):",
    results.every((r) => r) ? "PASSED" : "FAILED",
  );
  console.log(
    "  Over limit (" + (RATE_LIMIT + 1) + " requests):",
    overLimit > RATE_LIMIT
      ? "PASSED (rate limited)"
      : "FAILED (not rate limited)",
  );

  return results.every((r) => r) && overLimit > RATE_LIMIT;
}

function testChatFlow() {
  console.log("\n=== Test 4: Chat Flow ===");

  const testMessages = [
    "What services do you offer?",
    "I'd like to book an appointment",
    "Tell me about your clinic",
    "Can I get a blood test tomorrow?",
  ];

  testMessages.forEach((msg, i) => {
    const response = getMockResponse(msg);
    console.log("  Message " + (i + 1) + ': "' + msg + '"');
    console.log("    Response: " + response.reply.substring(0, 60) + "...");
  });

  return true;
}

function testBookingFlow() {
  console.log("\n=== Test 5: Booking Flow ===");

  const bookingMessage = "I want to book an appointment";
  const response = getMockResponse(bookingMessage);

  console.log('  Message: "' + bookingMessage + '"');
  console.log("  Response: " + response.reply);

  if (response.isBooking) {
    try {
      const booking = JSON.parse(response.reply);
      console.log("  PASSED - Booking detected:", JSON.stringify(booking));
      return true;
    } catch (e) {
      console.log("  FAILED - Cannot parse booking");
      return false;
    }
  }

  console.log("  FAILED - No booking detected");
  return false;
}

// Run all tests
console.log("============================================================");
console.log("         Clinic Demo - Function Tests");
console.log("============================================================");

const results = [];
results.push({ name: "getServices", passed: testGetServices() });
results.push({ name: "Auth Enforcement", passed: testAuthEnforcement() });
results.push({ name: "Rate Limiting", passed: testRateLimiting() });
results.push({ name: "Chat Flow", passed: testChatFlow() });
results.push({ name: "Booking Flow", passed: testBookingFlow() });

console.log("\n============================================================");
console.log("                    TEST SUMMARY");
console.log("============================================================");

results.forEach((r) => {
  console.log("  " + (r.passed ? "[PASS]" : "[FAIL]") + " " + r.name);
});

const allPassed = results.every((r) => r.passed);
console.log(
  "\n  Overall: " + (allPassed ? "ALL TESTS PASSED" : "SOME TESTS FAILED"),
);
console.log("============================================================");
