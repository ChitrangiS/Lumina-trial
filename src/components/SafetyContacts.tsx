
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Phone, MapPin, Users, Plus, Share, Clock, AlertTriangle } from 'lucide-react';
import EmergencyContactForm from './EmergencyContactForm';
import LocationSharing from './LocationSharing';

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  priority: 'primary' | 'secondary' | 'emergency';
  isActive: boolean;
  lastContacted?: string;
  locationAccess: boolean;
}

const SafetyContacts = () => {
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [isLocationSharing, setIsLocationSharing] = useState(false);
  const [selectedContact, setSelectedContact] = useState<EmergencyContact | null>(null);

  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      relationship: 'Sister',
      phone: '+91-9876543210',
      email: 'sarah.j@email.com',
      priority: 'primary',
      isActive: true,
      lastContacted: '2 hours ago',
      locationAccess: true
    },
    {
      id: '2',
      name: 'Mike Chen',
      relationship: 'Partner',
      phone: '+91-9876543211',
      email: 'mike.chen@email.com',
      priority: 'primary',
      isActive: true,
      lastContacted: '5 hours ago',
      locationAccess: true
    },
    {
      id: '3',
      name: 'Campus Security',
      relationship: 'Security',
      phone: '+91-9876543212',
      email: 'security@university.edu',
      priority: 'emergency',
      isActive: true,
      lastContacted: 'Never',
      locationAccess: false
    },
    {
      id: '4',
      name: 'Emily Rodriguez',
      relationship: 'Best Friend',
      phone: '+91-9876543213',
      email: 'emily.r@email.com',
      priority: 'secondary',
      isActive: false,
      lastContacted: '1 day ago',
      locationAccess: true
    }
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'primary': return 'bg-red-100 text-red-800';
      case 'emergency': return 'bg-orange-100 text-orange-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const handleAddContact = (newContact: Omit<EmergencyContact, 'id'>) => {
    const contact: EmergencyContact = {
      ...newContact,
      id: Date.now().toString(),
    };
    setEmergencyContacts([...emergencyContacts, contact]);
    setIsAddingContact(false);
  };

  const handleContactSOS = (contact: EmergencyContact) => {
    console.log(`Sending SOS to ${contact.name}...`);
    // Here would be actual SOS implementation
  };

  const handleShareLocation = (contact: EmergencyContact) => {
    setSelectedContact(contact);
    setIsLocationSharing(true);
  };

  const toggleContactStatus = (id: string) => {
    setEmergencyContacts(contacts =>
      contacts.map(contact =>
        contact.id === id ? { ...contact, isActive: !contact.isActive } : contact
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="w-5 h-5" />
            Emergency Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              variant="destructive"
              className="h-16 flex-col gap-2"
              onClick={() => emergencyContacts.filter(c => c.priority === 'primary').forEach(handleContactSOS)}
            >
              <Phone className="w-6 h-6" />
              Alert All Primary
            </Button>
            <Button
              variant="outline"
              className="h-16 flex-col gap-2 border-orange-300 text-orange-700"
              onClick={() => setIsLocationSharing(true)}
            >
              <Share className="w-6 h-6" />
              Share Location
            </Button>
            <Dialog open={isAddingContact} onOpenChange={setIsAddingContact}>
              <DialogTrigger asChild>
                <Button variant="outline" className="h-16 flex-col gap-2">
                  <Plus className="w-6 h-6" />
                  Add Contact
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Emergency Contact</DialogTitle>
                </DialogHeader>
                <EmergencyContactForm onSubmit={handleAddContact} />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Location Sharing */}
      {isLocationSharing && (
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Live Location Sharing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LocationSharing
              contacts={emergencyContacts.filter(c => c.locationAccess && c.isActive)}
              selectedContact={selectedContact}
              onClose={() => {
                setIsLocationSharing(false);
                setSelectedContact(null);
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Emergency Contacts List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Emergency Contacts
            </div>
            <Badge variant="secondary">
              {emergencyContacts.filter(c => c.isActive).length} Active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {emergencyContacts.map((contact) => (
              <div
                key={contact.id}
                className={`p-4 border rounded-lg ${contact.isActive ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-lg">
                      {contact.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{contact.name}</h3>
                        <Badge className={getPriorityColor(contact.priority)}>
                          {contact.priority}
                        </Badge>
                        {!contact.isActive && (
                          <Badge variant="secondary" className="bg-gray-200 text-gray-600">
                            Inactive
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{contact.relationship}</p>
                      <p className="text-sm text-gray-500">{contact.phone}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Last contact: {contact.lastContacted}
                        </span>
                        {contact.locationAccess && (
                          <span className="flex items-center gap-1 text-green-600">
                            <MapPin className="w-3 h-3" />
                            Location access
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleContactSOS(contact)}
                        disabled={!contact.isActive}
                      >
                        SOS
                      </Button>
                      {contact.locationAccess && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleShareLocation(contact)}
                          disabled={!contact.isActive}
                        >
                          <Share className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleContactStatus(contact.id)}
                    >
                      {contact.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {emergencyContacts.filter(c => c.priority === 'primary').length}
            </div>
            <div className="text-sm text-gray-600">Primary Contacts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {emergencyContacts.filter(c => c.locationAccess).length}
            </div>
            <div className="text-sm text-gray-600">Location Access</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {emergencyContacts.filter(c => c.isActive).length}
            </div>
            <div className="text-sm text-gray-600">Active Contacts</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SafetyContacts;
