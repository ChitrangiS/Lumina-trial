
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone } from 'lucide-react';

interface EmergencyPanelProps {
  onClose: () => void;
}

const EmergencyPanel = ({ onClose }: EmergencyPanelProps) => {
  const [isActivated, setIsActivated] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const handleEmergencyActivation = () => {
    setIsActivated(true);
    // Simulate countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Here would be actual emergency activation
          console.log('Emergency services contacted!');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4">
      <div className="max-w-7xl mx-auto">
        <Card className="border-red-200 bg-white">
          <CardHeader className="bg-red-500 text-white">
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Emergency Mode Activated
              <Badge variant="destructive" className="ml-auto bg-white text-red-600">
                PRIORITY
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {!isActivated ? (
              <div className="space-y-4">
                <div className="text-center space-y-3">
                  <h3 className="text-xl font-semibold text-red-800">
                    Are you in immediate danger?
                  </h3>
                  <p className="text-gray-600">
                    This will immediately contact emergency services and notify your trusted contacts
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">This will:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Call 911 automatically</li>
                      <li>• Send your location to emergency services</li>
                      <li>• Alert your emergency contacts</li>
                      <li>• Start live location sharing</li>
                      <li>• Activate audio recording</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Your emergency contacts:</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>• Sarah Johnson (Sister)</div>
                      <div>• Mike Chen (Partner)</div>
                      <div>• Campus Security</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 justify-center pt-4">
                  <Button
                    variant="destructive"
                    size="lg"
                    onClick={handleEmergencyActivation}
                    className="emergency-gradient animate-pulse-emergency"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    ACTIVATE EMERGENCY
                  </Button>
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto bg-red-500 rounded-full flex items-center justify-center animate-pulse-emergency">
                  <Phone className="w-10 h-10 text-white" />
                </div>
                
                {countdown > 0 ? (
                  <div>
                    <h3 className="text-2xl font-bold text-red-600">
                      Contacting Emergency Services in {countdown}s
                    </h3>
                    <p className="text-gray-600">Press cancel to abort</p>
                    <Button variant="outline" onClick={onClose} className="mt-3">
                      Cancel Emergency Call
                    </Button>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-2xl font-bold text-green-600">
                      Emergency Services Contacted
                    </h3>
                    <p className="text-gray-600">
                      Help is on the way. Stay safe and keep your phone with you.
                    </p>
                    <Badge className="bg-green-100 text-green-800 mt-2">
                      Location shared with authorities
                    </Badge>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmergencyPanel;
