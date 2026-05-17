import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Brain, Send, AlertCircle, Stethoscope } from 'lucide-react';
import { storage } from '@/lib/storage';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AIAssistant = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentUser = storage.getUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);

    // Initial greeting
    setMessages([
      {
        role: 'assistant',
        content: `Hello ${currentUser.name?.split(' ')[0]}! I'm your AI Health Assistant. I can help you with:\n\n• Symptom analysis and possible conditions\n• Health advice and guidance\n• Understanding your medications\n• General health questions\n\nWhat symptoms or health concerns would you like to discuss today?`
      }
    ]);
  }, [navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const simulateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Symptom analysis
    if (lowerMessage.includes('fever') || lowerMessage.includes('temperature')) {
      return `Based on your symptoms of fever, here's what I can tell you:\n\n**Possible Causes:**\n• Viral infection (most common)\n• Bacterial infection\n• Inflammation\n\n**Recommendations:**\n1. Monitor your temperature regularly\n2. Stay hydrated\n3. Rest adequately\n4. Take acetaminophen if temperature exceeds 100°F\n\n**When to see a doctor:**\n• Fever above 103°F (39.4°C)\n• Fever lasting more than 3 days\n• Severe headache or stiff neck\n• Difficulty breathing\n\n**Suggested Specialist:** General Physician\n\nWould you like me to help you book an appointment?`;
    }

    if (lowerMessage.includes('headache') || lowerMessage.includes('head pain')) {
      return `I understand you're experiencing headaches. Let me help analyze this:\n\n**Common Types:**\n• Tension headache (most common)\n• Migraine\n• Cluster headache\n• Sinus headache\n\n**When to be concerned:**\n• Sudden, severe headache\n• Headache with vision changes\n• Headache with fever and stiff neck\n• Headache after head injury\n\n**Immediate Relief:**\n• Rest in a quiet, dark room\n• Apply cold compress\n• Stay hydrated\n• Gentle neck stretches\n\n**Suggested Specialist:** Neurologist (if severe or recurring)\n\nWould you like more information about any specific type?`;
    }

    if (lowerMessage.includes('cough') || lowerMessage.includes('cold')) {
      return `For your cough and cold symptoms:\n\n**Likely Causes:**\n• Viral upper respiratory infection\n• Common cold\n• Allergies\n• Post-nasal drip\n\n**Home Care:**\n1. Drink plenty of warm fluids\n2. Use a humidifier\n3. Gargle with salt water\n4. Get adequate rest\n5. Consider honey for cough (if over 1 year)\n\n**Over-the-counter options:**\n• Paracetamol for discomfort\n• Antihistamines for allergies\n• Cough suppressants (consult pharmacist)\n\n**See a doctor if:**\n• Cough persists beyond 3 weeks\n• Difficulty breathing\n• Chest pain\n• High fever\n\nWould you like me to suggest some medicines from our pharmacy?`;
    }

    if (lowerMessage.includes('stomach') || lowerMessage.includes('pain') || lowerMessage.includes('ache')) {
      return `I'll help you with stomach concerns:\n\n**Common Causes:**\n• Indigestion\n• Gas and bloating\n• Gastritis\n• Food intolerance\n\n**Self-Care Tips:**\n1. Eat smaller, frequent meals\n2. Avoid spicy and fatty foods\n3. Stay upright after eating\n4. Reduce stress\n5. Avoid trigger foods\n\n**Red Flags (seek immediate care):**\n• Severe, sudden pain\n• Blood in vomit or stool\n• Persistent vomiting\n• Signs of dehydration\n\n**Suggested Tests:**\n• Complete Blood Count\n• Stool examination\n• Ultrasound (if needed)\n\n**Suggested Specialist:** Gastroenterologist\n\nWould you like to book a lab test or consultation?`;
    }

    if (lowerMessage.includes('medicine') || lowerMessage.includes('medication')) {
      return `I can help with medication information:\n\n**General Medication Tips:**\n• Always take prescribed dosage\n• Complete the full course of antibiotics\n• Note any side effects\n• Check expiry dates\n• Store as directed\n\n**Before Taking Any Medicine:**\n• Inform about allergies\n• Mention other medications\n• Ask about food interactions\n• Understand dosage timing\n\n**Our Services:**\n• Browse medicines in our pharmacy\n• Upload prescriptions\n• Get reminders for refills\n• Home delivery available\n\nWould you like to browse our medicine catalog or need information about a specific medication?`;
    }

    if (lowerMessage.includes('appointment') || lowerMessage.includes('doctor')) {
      return `I can help you book a doctor's appointment!\n\n**Available Specialties:**\n• Cardiology\n• Dermatology\n• Pediatrics\n• Orthopedics\n• General Medicine\n\n**Appointment Features:**\n• Same-day appointments available\n• Video consultations\n• Multiple time slots\n• Easy rescheduling\n\nWould you like me to direct you to the appointments page to see available doctors?`;
    }

    // Default response
    return `Thank you for your question. As an AI assistant, I can provide general health information, but I'm not a replacement for professional medical advice.\n\n**I can help you with:**\n• Symptom analysis\n• General health questions\n• Booking appointments\n• Finding medicines\n• Lab test information\n\n**Important:** If you have a medical emergency, please call 112 or visit our Emergency Services immediately.\n\nCould you please provide more details about your symptoms or health concern? The more specific you are, the better I can assist you.`;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        role: 'assistant',
        content: simulateAIResponse(input),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-none">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Health Assistant</CardTitle>
                  <CardDescription>Powered by advanced AI for health guidance</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                <p className="text-sm text-foreground">
                  <strong>Medical Disclaimer:</strong> This provides general health information only. 
                  Always consult a qualified healthcare professional for medical advice, diagnosis, or treatment.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Chat Messages */}
          <Card className="min-h-[500px] flex flex-col">
            <CardContent className="flex-1 p-6 space-y-4 overflow-y-auto max-h-[500px]">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-2">
                        <Stethoscope className="h-4 w-4" />
                        <span className="text-xs font-semibold">Health Assistant</span>
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg p-4 bg-muted">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <span className="text-xs text-muted-foreground">Analyzing...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Describe your symptoms or ask a health question..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  disabled={isTyping}
                />
                <Button onClick={handleSend} disabled={isTyping || !input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-start"
              onClick={() => setInput('I have a fever and headache')}
            >
              <span className="font-semibold">Fever & Headache</span>
              <span className="text-xs text-muted-foreground">Common symptoms</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-start"
              onClick={() => setInput('I need to book an appointment')}
            >
              <span className="font-semibold">Book Appointment</span>
              <span className="text-xs text-muted-foreground">Find a doctor</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-start"
              onClick={() => setInput('Tell me about stomach pain')}
            >
              <span className="font-semibold">Stomach Pain</span>
              <span className="text-xs text-muted-foreground">Get information</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIAssistant;
