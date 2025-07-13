
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface EmergencyContactFormData {
  name: string;
  relationship: string;
  phone: string;
  email: string;
  priority: 'primary' | 'secondary' | 'emergency';
  isActive: boolean;
  locationAccess: boolean;
}

interface EmergencyContactFormProps {
  onSubmit: (contact: EmergencyContactFormData) => void;
}

const EmergencyContactForm = ({ onSubmit }: EmergencyContactFormProps) => {
  const [formData, setFormData] = useState<EmergencyContactFormData>({
    name: '',
    relationship: '',
    phone: '',
    email: '',
    priority: 'secondary',
    isActive: true,
    locationAccess: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.phone) {
      onSubmit(formData);
      setFormData({
        name: '',
        relationship: '',
        phone: '',
        email: '',
        priority: 'secondary',
        isActive: true,
        locationAccess: false
      });
    }
  };

  const relationshipOptions = [
    'Parent', 'Sibling', 'Partner', 'Spouse', 'Friend', 'Colleague',
    'Security', 'Medical', 'Neighbor', 'Other'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Full Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter full name"
          required
        />
      </div>

      <div>
        <Label htmlFor="relationship">Relationship</Label>
        <Select 
          value={formData.relationship} 
          onValueChange={(value) => setFormData({ ...formData, relationship: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select relationship" />
          </SelectTrigger>
          <SelectContent>
            {relationshipOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="phone">Phone Number *</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+91-XXXXXXXXXX"
          required
        />
      </div>

      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="email@example.com"
        />
      </div>

      <div>
        <Label htmlFor="priority">Priority Level</Label>
        <Select 
          value={formData.priority} 
          onValueChange={(value: 'primary' | 'secondary' | 'emergency') => 
            setFormData({ ...formData, priority: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="primary">Primary - First to contact</SelectItem>
            <SelectItem value="secondary">Secondary - Backup contact</SelectItem>
            <SelectItem value="emergency">Emergency - Services only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="active">Active Contact</Label>
            <p className="text-sm text-gray-600">Enable notifications for this contact</p>
          </div>
          <Switch
            id="active"
            checked={formData.isActive}
            onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="location">Location Access</Label>
            <p className="text-sm text-gray-600">Allow sharing live location</p>
          </div>
          <Switch
            id="location"
            checked={formData.locationAccess}
            onCheckedChange={(checked) => setFormData({ ...formData, locationAccess: checked })}
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1">
          Add Contact
        </Button>
        <Button type="button" variant="outline" onClick={() => setFormData({
          name: '',
          relationship: '',
          phone: '',
          email: '',
          priority: 'secondary',
          isActive: true,
          locationAccess: false
        })}>
          Clear
        </Button>
      </div>
    </form>
  );
};

export default EmergencyContactForm;
