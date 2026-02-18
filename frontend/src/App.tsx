import React, { useState, useEffect } from 'react';
import './App.css';

interface Service {
  serviceId: number;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
}

// Fallback mock data when API is unavailable
const mockServices: Service[] = [
  { serviceId: 1, name: 'General Checkup', description: 'Regular health checkup', durationMinutes: 30, price: 150.00 },
  { serviceId: 2, name: 'Blood Test', description: 'Complete blood count analysis', durationMinutes: 15, price: 80.00 },
  { serviceId: 3, name: 'X-Ray', description: 'Chest X-Ray examination', durationMinutes: 20, price: 120.00 },
];

function App() {
  const [services, setServices] = useState<Service[]>([]);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(false);

  useEffect(() => {
    fetch('/api/getServices')
      .then(res => {
        if (!res.ok) throw new Error('API not available');
        return res.json();
      })
      .then(setServices)
      .catch((err) => {
        console.warn('API unavailable, using mock data:', err.message);
        setUseMockData(true);
        setServices(mockServices);
      });
  }, []);

  const sendMessage = async () => {
    if (!message || loading) return;
    setLoading(true);
    setError(null);
    try {
      const body = { message, history: chatHistory };
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      
      if (!res.ok) throw new Error('Chat API unavailable');
      
      const data = await res.json();
      if (data.history) {
        setChatHistory(data.history);
      }
      setReply(data.reply);
      setMessage('');
    } catch (err) {
      console.warn('Chat API unavailable, using mock response');
      // Use mock response
      const mockResponses = [
        "Our clinic offers General Checkup, Blood Test, X-Ray and more. Would you like to book an appointment?",
        "I'd be happy to help you book an appointment! Please let me know which service you're interested in.",
        "Our General Checkup costs $150 and takes about 30 minutes. Would you like to schedule one?",
      ];
      setReply(mockResponses[Math.floor(Math.random() * mockResponses.length)]);
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="App">
      <header>
        <h1>🏥 Clinic Demo</h1>
        {useMockData && <span className="mock-badge">Demo Mode</span>}
      </header>
      
      <section className="services-section">
        <h2>Available Services</h2>
        {services.length === 0 ? (
          <p>Loading services...</p>
        ) : (
          <ul>
            {services.map(s => (
              <li key={s.serviceId}>
                <strong>{s.name}</strong>
                <span className="price">${s.price}</span>
                <span className="duration">{s.durationMinutes} min</span>
                <p>{s.description}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
      
      <section className="chat-section">
        <h2>💬 Chat with Us</h2>
        <div className="chat-container">
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about our services or book an appointment..."
            rows={3}
            disabled={loading}
          />
          <button onClick={sendMessage} disabled={loading}>
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
        
        {reply && (
          <div className="response">
            <strong>Assistant:</strong>
            <p>{reply}</p>
          </div>
        )}
        
        {error && (
          <div className="error">
            <p>{error}</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
