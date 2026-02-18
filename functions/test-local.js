// Local test script to simulate the functions without Azure Functions runtime
// Usage: node test-local.js

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

// Test getServices
console.log("=== Testing getServices ===");
console.log("GET /api/getServices");
console.log("Response:", JSON.stringify(mockServices, null, 2));

// Test chat with different messages
console.log("\n=== Testing Chat ===");

const testMessages = [
  "What services do you offer?",
  "I'd like to book an appointment",
  "Tell me about your clinic",
];

testMessages.forEach((msg, i) => {
  console.log(`\n--- Message ${i + 1}: "${msg}" ---`);
  const mock = getMockResponse(msg);
  console.log("Response:", mock.reply);
  if (mock.isBooking) {
    console.log("(Booking detected - would create appointment)");
  }
});

console.log("\n=== All tests completed ===");
console.log("\nTo run the actual functions with Azure Functions runtime:");
console.log("1. Install Node.js 18 (use nvm or nvm-windows)");
console.log("2. Run: npm install -g azure-functions-core-tools@4");
console.log("3. Run: cd functions && npm install");
console.log("4. Run: func start");
