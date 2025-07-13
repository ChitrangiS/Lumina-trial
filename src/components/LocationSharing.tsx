
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { MapPin, Clock, Users, Share, AlertTriangle } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  relationship: string;
  locationAccess: boolean;
  isActive: boolean;
}

interface LocationSharingProps {
  contacts: Contact[];
  selectedContact?: Contact | null;
  onClose: () => void;
}

const LocationSharing = ({ contacts, selectedContact, onClose }: LocationSharingProps) => {
  const [isSharing, setIsSharing] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [duration, setDuration] = useState(30); // minutes
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [currentLocation, setCurrentLocation] = useState<string>('Fetching location...');

  useEffect(() => {
    if (selectedContact) {
      setSelectedContacts([selectedContact.id]);
    }
  }, [selectedContact]);

  useEffect(() => {
    // Simulate getting current location
    setTimeout(() => {
      setCurrentLocation('Connaught Place, New Delhi, Delhi 110001');
    }, 2000);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSharing && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsSharing(false);
            return 0;
          }
          return prev - 1;
        });
      }, 60000); // Update every minute
    }
    return () => clearInterval(timer);
  }, [isSharing, timeRemaining]);

  const handleStartSharing = () => {
    if (selectedContacts.length > 0) {
      setIsSharing(true);
      setTimeRemaining(duration);
      console.log('Started sharing location with:', selectedContacts);
    }
  };

  const handleStopSharing = () => {
    setIsSharing(false);
    setTimeRemaining(0);
    console.log('Stopped sharing location');
  };

  const toggleContact = (contactId: string) => {
    setSelectedContacts(prev =>
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="space-y-4">
      {/* Current Status */}
      {isSharing ? (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <h3 className="font-medium text-green-800">Location Sharing Active</h3>
                  <p className="text-sm text-green-600">
                    Sharing with {selectedContacts.length} contact(s)
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-green-800">{formatTime(timeRemaining)}</div>
                <div className="text-xs text-green-600">remaining</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="font-medium text-blue-800">Ready to Share Location</h3>
                <p className="text-sm text-blue-600">Select contacts and duration below</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Location */}
      <div className="p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 mb-1">
          <MapPin className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium">Current Location:</span>
        </div>
        <p className="text-sm text-gray-700">{currentLocation}</p>
      </div>

      {/* Duration Selection */}
      {!isSharing && (
        <div>
          <h4 className="font-medium mb-3">Sharing Duration</h4>
          <div className="grid grid-cols-4 gap-2">
            {[15, 30, 60, 120].map((mins) => (
              <Button
                key={mins}
                variant={duration === mins ? "default" : "outline"}
                size="sm"
                onClick={() => setDuration(mins)}
              >
                {formatTime(mins)}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Contact Selection */}
      <div>
        <h4 className="font-medium mb-3">
          Select Contacts {!isSharing && `(${selectedContacts.length} selected)`}
        </h4>
        <div className="space-y-2">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className={`p-3 border rounded-lg flex items-center justify-between ${
                selectedContacts.includes(contact.id) 
                  ? 'bg-blue-50 border-blue-200' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {contact.name.charAt(0)}
                </div>
                <div>
                  <h5 className="font-medium">{contact.name}</h5>
                  <p className="text-sm text-gray-600">{contact.relationship}</p>
                </div>
              </div>
              {!isSharing ? (
                <Switch
                  checked={selectedContacts.includes(contact.id)}
                  onCheckedChange={() => toggleContact(contact.id)}
                />
              ) : (
                selectedContacts.includes(contact.id) && (
                  <Badge className="bg-green-100 text-green-800">
                    Receiving
                  </Badge>
                )
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sharing Info */}
      {isSharing && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800 mb-1">Sharing Information</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Your contacts can see your real-time location</li>
                  <li>• Location updates every 30 seconds</li>
                  <li>• Sharing will stop automatically in {formatTime(timeRemaining)}</li>
                  <li>• You can stop sharing anytime</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        {!isSharing ? (
          <>
            <Button
              onClick={handleStartSharing}
              disabled={selectedContacts.length === 0}
              className="flex-1"
            >
              <Share className="w-4 h-4 mr-2" />
              Start Sharing ({formatTime(duration)})
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="destructive"
              onClick={handleStopSharing}
              className="flex-1"
            >
              Stop Sharing
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </>
        )}
      </div>

      {/* Statistics */}
      {contacts.length > 0 && (
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-800">{contacts.length}</div>
            <div className="text-xs text-gray-600">Available Contacts</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-800">{selectedContacts.length}</div>
            <div className="text-xs text-gray-600">
              {isSharing ? 'Receiving Updates' : 'Selected'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSharing;
