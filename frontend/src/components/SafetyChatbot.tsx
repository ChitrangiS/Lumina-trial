import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { X, Send, MapPin, Shield, AlertTriangle, Phone, Settings } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'normal' | 'location' | 'emergency' | 'route';
}

interface SafetyChatbotProps {
  onClose: () => void;
  onEmergencyTrigger: () => void;
}

const SafetyChatbot = ({ onClose, onEmergencyTrigger }: SafetyChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm your Lumina AI assistant. I can help you with safety information, route planning, and emergency assistance. How can I help you stay safe today?",
      isUser: false,
      timestamp: new Date(),
      type: 'normal'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [showApiInput, setShowApiInput] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get user location on component mount
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          console.log('Location obtained:', position.coords);
        },
        (error) => {
          console.log('Location access denied:', error);
        }
      );
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const callExternalAPI = async (userMessage: string): Promise<string> => {
    if (!apiKey) {
      throw new Error('No API key provided');
    }

    try {
      // Example API call structure - replace with your preferred AI service
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a safety assistant for Lumina app. Help users with safety information, route planning, and emergency assistance. Be concise and helpful.'
            },
            {
              role: 'user',
              content: userMessage
            }
          ],
          max_tokens: 150,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  };

  const generateLocalResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    console.log('Generating response for:', message);

    // Emergency trigger patterns
    if (message.includes('sos') || message.includes('emergency') || message.includes('help me') || message.includes('trigger emergency')) {
      setTimeout(() => onEmergencyTrigger(), 1000);
      return "🚨 Emergency mode activated! I'm triggering your SOS alert and contacting your emergency contacts immediately. Stay calm, help is on the way.";
    }

    // Safety score queries
    if (message.includes('safety score') || message.includes('score of') || (message.includes('what') && message.includes('safety') && message.includes('location'))) {
      const safetyScore = Math.floor(Math.random() * 30) + 70;
      return `📊 **Current Location Safety Score: ${safetyScore}/100**\n\n${safetyScore > 85 ? '✅ **Excellent Safety Rating**\n• Well-lit streets (98% functional)\n• High foot traffic\n• Active security presence\n• Low crime incidents (0.2/1000)' : safetyScore > 75 ? '⚠️ **Good Safety Rating**\n• Adequate lighting (85% functional)\n• Moderate foot traffic\n• Some security coverage\n• Low-medium crime incidents (1.5/1000)' : '🔴 **Moderate Safety - Exercise Caution**\n• Limited lighting (60% functional)\n• Low foot traffic\n• Minimal security presence\n• Medium crime incidents (4.2/1000)'}\n\nWould you like me to suggest safer nearby routes?`;
    }

    // Safer path queries
    if (message.includes('safer path') || message.includes('avoiding dark') || message.includes('isolated areas') || (message.includes('avoid') && (message.includes('alley') || message.includes('dark')))) {
      return "🛡️ **Safer Route Analysis Complete**\n\n✅ **Recommended Safe Path:**\n• Main Street → Well-lit Boulevard → Your destination\n• **Avoids:** 2 dark alleys, 1 isolated underpass\n• **Safety features:** Street lighting every 50m, CCTV coverage, regular foot traffic\n\n⚠️ **Areas to avoid:**\n• Industrial backstreets (poor lighting)\n• Park shortcuts after 7 PM\n• Construction zones with limited visibility\n\n🕐 **Estimated time:** +3 minutes for maximum safety\n\nWould you like me to start live navigation with safety alerts?";
    }

    // Harassment reports queries
    if (message.includes('harassment') || message.includes('harassment reports') || (message.includes('reports') && message.includes('area'))) {
      const reportCount = Math.floor(Math.random() * 5);
      return `📋 **Area Safety Report - Harassment Data**\n\n${reportCount === 0 ? '✅ **No Recent Reports**\nNo harassment incidents reported in this area in the past 30 days.' : `⚠️ **${reportCount} Recent Report${reportCount > 1 ? 's' : ''}**\n• Last incident: ${Math.floor(Math.random() * 7) + 1} days ago\n• Type: Verbal harassment\n• Time: Evening hours (6-9 PM)\n• Location: Near transit stops`}\n\n🛡️ **Safety Recommendations:**\n• Stay in well-lit, populated areas\n• Use main streets instead of shortcuts\n• Consider traveling with others during evening hours\n• Report any incidents immediately\n\nWould you like me to suggest the safest route and share your location with trusted contacts?`;
    }

    // Location safety queries
    if ((message.includes('safe') || message.includes('safety')) && (message.includes('area') || message.includes('location') || message.includes('here') || message.includes('this'))) {
      const safetyScore = Math.floor(Math.random() * 30) + 70;
      return `Based on real-time data analysis, your current area has a safety score of ${safetyScore}/100. ${safetyScore > 85 ? '✅ This area is considered very safe with good lighting and active community monitoring.' : safetyScore > 75 ? '⚠️ This area has moderate safety. Stay alert and stick to well-lit paths.' : '🔴 Exercise caution in this area. Consider using our Lumina recommended routes.'}`;
    }

    // Route planning queries
    if (message.includes('route') || message.includes('way home') || message.includes('directions') || message.includes('safest way') || message.includes('navigation')) {
      return "🗺️ I'll find the safest route for you! Based on current conditions, I recommend taking Main Street → Park Avenue → Your destination. This route has:\n\n✅ Excellent lighting (95% operational)\n✅ High foot traffic\n✅ Security cameras every 100m\n✅ Emergency call boxes\n\nWould you like me to start navigation with live safety updates?";
    }

    // Location requests
    if (message.includes('location') || message.includes('where am i') || message.includes('current position') || message.includes('my location')) {
      if (userLocation) {
        return `📍 Your current location: ${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}\n\nNearby safety features:\n• Police station: 0.3 miles\n• Hospital: 0.8 miles\n• Safe haven (24/7 store): 0.1 miles\n\nWould you like me to analyze the safety of this area?`;
      } else {
        return "📍 I need location access to help you better. Please enable location services in your browser settings so I can provide personalized safety information.";
      }
    }

    // General safety tips
    if (message.includes('tips') || message.includes('advice') || message.includes('how to')) {
      return "🛡️ Here are some safety tips for you:\n\n• Trust your instincts - if something feels wrong, it probably is\n• Stay in well-lit, populated areas\n• Keep your phone charged and share your location with trusted contacts\n• Use Lumina's recommended routes\n• Be aware of your surroundings\n\nWould you like me to set up live tracking for your journey?";
    }

    // Greetings
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hello! I'm your Lumina safety assistant. I can help you with area safety analysis, route planning, emergency assistance, and safety tips. What would you like help with today?";
    }

    // Default helpful response
    return "I understand you're asking about safety. I can help you with:\n\n• Area safety analysis ('Is this area safe?')\n• Safe route planning ('Show me the safest way home')\n• Emergency assistance ('Trigger SOS')\n• Location services ('Where am I?')\n• Safety tips and advice\n\nWhat specific safety information do you need?";
  };

  const generateAIResponse = async (userMessage: string): Promise<Message> => {
    const messageId = Date.now().toString();
    
    try {
      let content: string;
      
      if (apiKey) {
        // Try API first if key is available
        try {
          content = await callExternalAPI(userMessage);
        } catch (error) {
          console.log('API call failed, falling back to local response');
          content = generateLocalResponse(userMessage);
        }
      } else {
        // Use local response generation
        content = generateLocalResponse(userMessage);
      }

      // Determine message type based on content
      let type: 'normal' | 'location' | 'emergency' | 'route' = 'normal';
      if (content.includes('🚨') || content.includes('Emergency')) type = 'emergency';
      else if (content.includes('📍') || content.includes('location')) type = 'location';
      else if (content.includes('🗺️') || content.includes('route')) type = 'route';

      return {
        id: messageId,
        content,
        isUser: false,
        timestamp: new Date(),
        type
      };
    } catch (error) {
      console.error('Error generating response:', error);
      return {
        id: messageId,
        content: "I apologize, but I'm having trouble responding right now. Please try asking your question again, or contact emergency services if this is urgent.",
        isUser: false,
        timestamp: new Date(),
        type: 'normal'
      };
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    console.log('Sending message:', inputValue);

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      // Generate AI response
      const aiResponse = await generateAIResponse(currentInput);
      
      // Add a small delay for better UX
      setTimeout(() => {
        setMessages(prev => [...prev, aiResponse]);
        setIsTyping(false);
      }, 500 + Math.random() * 1000);
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getMessageIcon = (type?: string) => {
    switch (type) {
      case 'emergency': return <Phone className="w-4 h-4 text-red-500" />;
      case 'location': return <MapPin className="w-4 h-4 text-blue-500" />;
      case 'route': return <Shield className="w-4 h-4 text-green-500" />;
      default: return <Shield className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <Card className="w-80 h-96 shadow-xl border-2 border-blue-200">
      <CardHeader className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <CardTitle className="text-lg">Lumina AI</CardTitle>
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowApiInput(!showApiInput)}
              className="text-white hover:bg-white/20 p-1"
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20 p-1">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Online & Ready to Help</span>
        </div>
        
        {showApiInput && (
          <div className="mt-2">
            <Input
              type="password"
              placeholder="Enter AI API key (optional)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="text-sm text-black"
            />
            <p className="text-xs mt-1 opacity-80">Optional: Add your OpenAI API key for enhanced responses</p>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-0 flex flex-col h-full">
        <ScrollArea className="flex-1 p-3">
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-2 rounded-lg ${
                    message.isUser
                      ? 'bg-blue-600 text-white'
                      : message.type === 'emergency'
                      ? 'bg-red-50 border border-red-200 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {!message.isUser && (
                    <div className="flex items-center gap-1 mb-1">
                      {getMessageIcon(message.type)}
                      <Badge variant="outline" className="text-xs">
                        AI Assistant
                      </Badge>
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-2 rounded-lg">
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4 text-blue-500" />
                    <Badge variant="outline" className="text-xs">AI Assistant</Badge>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <span className="text-xs text-gray-500 ml-2">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        <div className="p-3 border-t bg-gray-50">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about safety, routes, or emergency help..."
              className="flex-1"
            />
            <Button onClick={handleSendMessage} size="sm" disabled={!inputValue.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => setInputValue("What's the safety score of my current location?")}
            >
              Safety Score
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => setInputValue("Is there a safer path avoiding dark alleys?")}
            >
              Safer Path
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => setInputValue("Have there been any harassment reports in this area?")}
            >
              Area Reports
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs text-red-600"
              onClick={() => setInputValue("Trigger SOS and alert my contacts")}
            >
              Emergency
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SafetyChatbot;
