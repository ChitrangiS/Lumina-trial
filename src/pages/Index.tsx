
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Search, Phone } from 'lucide-react';
import SafetyMap from '@/components/SafetyMap';
import EmergencyPanel from '@/components/EmergencyPanel';
import RoutePanel from '@/components/RoutePanel';
import CommunityReports from '@/components/CommunityReports';
import LiveTracking from '@/components/LiveTracking';
import OfflineMode from '@/components/OfflineMode';
import DelhiRoutes from '@/components/DelhiRoutes';
import SafetyContacts from '@/components/SafetyContacts';
import SafetyChatbot from '@/components/SafetyChatbot';
import FloatingChatIcon from '@/components/FloatingChatIcon';

const Index = () => {
  const [activeTab, setActiveTab] = useState('map');
  const [destination, setDestination] = useState('');
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const handleEmergencyTrigger = () => {
    console.log('Emergency triggered from chatbot');
    setIsEmergencyMode(true);
    setIsChatbotOpen(false);
  };

  const handleChatIconClick = () => {
    console.log('Chat icon clicked, current state:', { isChatbotOpen });
    setIsChatbotOpen(!isChatbotOpen);
  };

  const handleChatbotClose = () => {
    console.log('Chatbot closing');
    setIsChatbotOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <header className="safety-gradient text-white p-4 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-glow">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Lumina</h1>
              <p className="text-purple-100 text-sm">Navigate not just faster, but safer</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <OfflineMode />
            <Button
              variant={isEmergencyMode ? "destructive" : "secondary"}
              size="sm"
              onClick={() => setIsEmergencyMode(!isEmergencyMode)}
              className={`font-semibold ${isEmergencyMode ? "animate-pulse-emergency emergency-gradient" : "bg-white/20 text-white hover:bg-white/30"}`}
            >
              <Phone className="w-4 h-4 mr-2" />
              {isEmergencyMode ? "Emergency Active" : "Emergency"}
            </Button>
          </div>
        </div>
      </header>

      {/* Emergency Panel */}
      {isEmergencyMode && (
        <div className="animate-slide-up">
          <EmergencyPanel onClose={() => setIsEmergencyMode(false)} />
        </div>
      )}

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Quick Search */}
        <Card className="animate-slide-up border-2 border-purple-200 shadow-lg">
          <CardHeader className="safety-gradient text-white">
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Where would you like to go safely?
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex gap-3">
              <Input
                placeholder="Enter destination address..."
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="flex-1 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
              />
              <Button className="cta-button text-white font-semibold px-6 hover:shadow-lg">
                Find Safe Route
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: 'map', label: 'Safety Map', badge: 'Live' },
            { id: 'delhi', label: 'Delhi Routes', badge: 'NCR' },
            { id: 'routes', label: 'Safe Routes', badge: 'AI' },
            { id: 'reports', label: 'Community Reports', badge: '24' },
            { id: 'tracking', label: 'Live Tracking', badge: 'New' },
            { id: 'contacts', label: 'Safety Contacts', badge: 'Emergency' }
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 whitespace-nowrap font-medium transition-all duration-200 ${
                activeTab === tab.id 
                  ? 'cta-button text-white shadow-lg' 
                  : 'border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300'
              }`}
            >
              {tab.label}
              <Badge 
                variant="secondary" 
                className={`text-xs font-semibold ${
                  activeTab === tab.id 
                    ? 'bg-white/20 text-white' 
                    : 'bg-purple-100 text-purple-700'
                }`}
              >
                {tab.badge}
              </Badge>
            </Button>
          ))}
        </div>

        <Separator className="bg-purple-200" />

        {/* Tab Content */}
        <div className="animate-slide-up">
          {activeTab === 'map' && <SafetyMap />}
          {activeTab === 'delhi' && <DelhiRoutes />}
          {activeTab === 'routes' && <RoutePanel destination={destination} />}
          {activeTab === 'reports' && <CommunityReports />}
          {activeTab === 'tracking' && <LiveTracking />}
          {activeTab === 'contacts' && <SafetyContacts />}
        </div>
      </div>

      {/* Floating AI Chatbot */}
      {isChatbotOpen && (
        <div className="fixed bottom-24 right-6 z-40 animate-slide-up">
          <SafetyChatbot 
            onClose={handleChatbotClose}
            onEmergencyTrigger={handleEmergencyTrigger}
          />
        </div>
      )}

      {/* Floating Chat Icon */}
      <FloatingChatIcon 
        onClick={handleChatIconClick}
        isActive={isChatbotOpen}
      />
    </div>
  );
};

export default Index;
