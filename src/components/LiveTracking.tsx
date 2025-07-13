
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

interface Contact {
  id: string;
  name: string;
  relationship: string;
  status: 'online' | 'offline';
  lastSeen?: string;
}

const LiveTracking = () => {
  const [isTrackingActive, setIsTrackingActive] = useState(false);
  const [autoCheckIns, setAutoCheckIns] = useState(true);

  const trustedContacts: Contact[] = [
    { id: '1', name: 'Sarah Johnson', relationship: 'Sister', status: 'online' },
    { id: '2', name: 'Mike Chen', relationship: 'Partner', status: 'online' },
    { id: '3', name: 'Campus Security', relationship: 'Security', status: 'online' },
    { id: '4', name: 'Emily Rodriguez', relationship: 'Best Friend', status: 'offline', lastSeen: '2 hours ago' }
  ];

  const getStatusBadge = (status: string) => {
    return status === 'online' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Tracking Control */}
      <Card className={isTrackingActive ? 'border-green-500 bg-green-50' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Live Tracking Status
            <Badge className={isTrackingActive ? 'bg-green-500' : 'bg-gray-500'}>
              {isTrackingActive ? 'ACTIVE' : 'INACTIVE'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Share Live Location</h3>
              <p className="text-sm text-muted-foreground">
                Allow trusted contacts to follow your journey in real-time
              </p>
            </div>
            <Switch 
              checked={isTrackingActive}
              onCheckedChange={setIsTrackingActive}
            />
          </div>

          {isTrackingActive && (
            <div className="space-y-3 pt-3 border-t animate-slide-up">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Started:</span>
                  <span className="font-medium ml-2">7:25 PM</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium ml-2">5 minutes</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Watchers:</span>
                  <span className="font-medium ml-2">3 active</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Next check-in:</span>
                  <span className="font-medium ml-2">2 minutes</span>
                </div>
              </div>
              
              <Button variant="destructive" size="sm" onClick={() => setIsTrackingActive(false)}>
                Stop Tracking
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Auto Check-ins */}
      <Card>
        <CardHeader>
          <CardTitle>Safety Check-ins</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Automatic Check-ins</h3>
              <p className="text-sm text-muted-foreground">
                Automatically send "I'm safe" messages every 15 minutes
              </p>
            </div>
            <Switch 
              checked={autoCheckIns}
              onCheckedChange={setAutoCheckIns}
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-green-800 font-medium">✓ Last check-in: 7:20 PM</span>
              <Button size="sm" variant="outline">
                Send Manual Check-in
              </Button>
            </div>
            
            <div className="text-sm text-muted-foreground">
              Next automatic check-in in 12 minutes
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trusted Contacts */}
      <Card>
        <CardHeader>
          <CardTitle>Trusted Contacts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {trustedContacts.map((contact) => (
            <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                  {contact.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-medium">{contact.name}</h4>
                  <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                  {contact.lastSeen && (
                    <p className="text-xs text-gray-500">Last seen: {contact.lastSeen}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusBadge(contact.status)}>
                  {contact.status}
                </Badge>
                <Button size="sm" variant="ghost">
                  {isTrackingActive ? 'Watching' : 'Notify'}
                </Button>
              </div>
            </div>
          ))}
          
          <Button variant="outline" className="w-full">
            + Add Trusted Contact
          </Button>
        </CardContent>
      </Card>

      {/* Journey History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Journeys</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { destination: 'University Library', time: 'Today 3:30 PM', duration: '12 min', status: 'completed' },
              { destination: 'Coffee Shop Downtown', time: 'Today 1:15 PM', duration: '8 min', status: 'completed' },
              { destination: 'Grocery Store', time: 'Yesterday 6:45 PM', duration: '15 min', status: 'completed' }
            ].map((journey, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">{journey.destination}</h4>
                  <p className="text-sm text-muted-foreground">{journey.time} • {journey.duration}</p>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  ✓ Safe arrival
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveTracking;
