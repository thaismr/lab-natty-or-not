const { Configuration, OpenAIApi } = require("openai");
const axios = require("axios");
const { checkAuthenticatedUser, rateLimit } = require("../utils");

let openai;
if (process.env.OPENAI_API_KEY && process.env.LOCAL_MODE !== 'true') {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  openai = new OpenAIApi(configuration);
}

// Mock responses for local development
const mockResponses = [
  "Our clinic offers General Checkup, Blood Test, X-Ray, MRI, Dental Cleaning, and Vaccination services. Which would you like to know more about?",
  "I'd be happy to help you book an appointment! Please let me know which service you're interested in and your preferred date and time.",
  "Great question! Our General Checkup costs $150 and takes about 30 minutes. Would you like to schedule one?",
  "We have appointments available this week. Would you like me to book a slot for you?",
  "Your health is our priority! We offer comprehensive medical services at competitive prices.",
];

function getMockResponse(message) {
  const lower = message.toLowerCase();
  if (lower.includes('book') || lower.includes('appointment') || lower.includes('schedule')) {
    return { reply: '{"action":"book","patientId":1,"serviceId":1,"scheduledAt":"2026-02-20T10:00"}', isBooking: true };
  }
  return { reply: mockResponses[Math.floor(Math.random() * mockResponses.length)], isBooking: false };
}

module.exports = async function (context, req) {
  context.log("chat function invoked.");

  if (!checkAuthenticatedUser(req)) {
    context.res = {
      status: 401,
      body: { error: "Authentication required" },
    };
    return;
  }

  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const count = rateLimit(ip);
  if (count > parseInt(process.env.CHAT_RATE_LIMIT || "100")) {
    context.res = { status: 429, body: { error: "Chat rate limit exceeded" } };
    return;
  }

  const { message, history } = req.body || {};
  if (!message) {
    context.res = { status: 400, body: { error: "Message required" } };
    return;
  }

  try {
    // Use mock AI for local development
    if (!openai || process.env.LOCAL_MODE === 'true') {
      context.log("Using mock AI response (local mode)");
      const mock = getMockResponse(message);
      let assistantMsg = mock.reply;
      let actionResult = null;

      if (mock.isBooking) {
        try {
          const obj = JSON.parse(assistantMsg);
          if (obj.action === "book") {
            // In local mode, skip actual booking and return mock result
            actionResult = { appointmentId: 999, status: "confirmed" };
            assistantMsg = `Appointment booked with ID ${actionResult.appointmentId} (mock)`;
          }
        } catch (e) {}
      }

      context.res = {
        status: 200,
        body: { reply: assistantMsg, history: history || [], actionResult, localMode: true },
      };
      return;
    }

    // Basic prompt: instruct model about available actions
    const prompt = `You are an assistant for a medical clinic. Users can ask about services or request to book an appointment. When a booking is requested, return JSON like {"action":"book","patientId":1,"serviceId":2,"scheduledAt":"2026-02-20T10:00"} otherwise just respond normally.`;

    const chatHistory = history || [];
    chatHistory.push({ role: "user", content: message });

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: prompt }, ...chatHistory],
      max_tokens: 500,
    });

    let assistantMsg = response.data.choices[0].message.content;
    let actionResult = null;

    // detect booking JSON from assistant message
    try {
      const obj = JSON.parse(assistantMsg);
      if (obj.action === "book") {
        // call createAppointment function internally
        const res = await axios.post(
          process.env.FUNCTION_BASE_URL + "/api/createAppointment",
          obj,
          {
            headers: {
              "x-ms-client-principal": req.headers["x-ms-client-principal"] || "",
            },
          },
        );
        actionResult = res.data;
        assistantMsg = `Appointment booked with ID ${actionResult.appointmentId}`;
      }
    } catch (e) {
      // not JSON or no action
    }

    context.res = {
      status: 200,
      body: { reply: assistantMsg, history: chatHistory, actionResult },
    };
  } catch (err) {
    context.log.error("Error in chat function", err);
    context.res = { status: 500, body: { error: "Chat failed" } };
  }
};
