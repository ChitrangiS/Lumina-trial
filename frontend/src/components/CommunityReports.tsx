
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Report {
  id: string;
  type: 'incident' | 'suspicious' | 'hazard' | 'safe-spot';
  location: string;
  description: string;
  timestamp: string;
  verified: boolean;
  votes: number;
}

const CommunityReports = () => {
  const [showReportForm, setShowReportForm] = useState(false);
  const [newReport, setNewReport] = useState({ type: '', location: '', description: '' });

  const reports: Report[] = [
    {
      id: '1',
      type: 'incident',
      location: 'Main St & 5th Ave',
      description: 'Witnessed a theft incident near the bus stop. Police were called and responded quickly.',
      timestamp: '2 hours ago',
      verified: true,
      votes: 12
    },
    {
      id: '2',
      type: 'suspicious',
      location: 'Riverside Park',
      description: 'Group of individuals acting suspiciously near the playground area. Avoided and took alternate route.',
      timestamp: '4 hours ago',
      verified: false,
      votes: 8
    },
    {
      id: '3',
      type: 'hazard',
      location: 'University Ave',
      description: 'Large pothole and poor street lighting. Several people have tripped in this area.',
      timestamp: '6 hours ago',
      verified: true,
      votes: 15
    },
    {
      id: '4',
      type: 'safe-spot',
      location: 'Central Plaza',
      description: 'Well-lit area with good security presence. Feels very safe even at night.',
      timestamp: '8 hours ago',
      verified: true,
      votes: 23
    }
  ];

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'incident': return 'bg-red-100 text-red-800';
      case 'suspicious': return 'bg-orange-100 text-orange-800';
      case 'hazard': return 'bg-yellow-100 text-yellow-800';
      case 'safe-spot': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'incident': return 'Incident';
      case 'suspicious': return 'Suspicious Activity';
      case 'hazard': return 'Hazard';
      case 'safe-spot': return 'Safe Spot';
      default: return type;
    }
  };

  const handleSubmitReport = () => {
    console.log('Submitting report:', newReport);
    setNewReport({ type: '', location: '', description: '' });
    setShowReportForm(false);
    // Here would be actual submission logic
  };

  return (
    <div className="space-y-6">
      {/* Header with Report Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Community Safety Reports</h2>
          <p className="text-muted-foreground">Real-time safety updates from your community</p>
        </div>
        <Button 
          onClick={() => setShowReportForm(!showReportForm)}
          className="bg-gradient-to-r from-blue-600 to-blue-700"
        >
          {showReportForm ? 'Cancel' : 'Report Incident'}
        </Button>
      </div>

      {/* Report Form */}
      {showReportForm && (
        <Card className="animate-slide-up border-blue-200">
          <CardHeader>
            <CardTitle>Submit Safety Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Report Type</label>
                <Select value={newReport.type} onValueChange={(value) => setNewReport({...newReport, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="incident">Incident</SelectItem>
                    <SelectItem value="suspicious">Suspicious Activity</SelectItem>
                    <SelectItem value="hazard">Hazard</SelectItem>
                    <SelectItem value="safe-spot">Safe Spot</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  placeholder="e.g., Main St & 1st Ave"
                  value={newReport.location}
                  onChange={(e) => setNewReport({...newReport, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                placeholder="Describe what you observed..."
                value={newReport.description}
                onChange={(e) => setNewReport({...newReport, description: e.target.value})}
                rows={3}
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={handleSubmitReport} className="flex-1">
                Submit Report
              </Button>
              <Button variant="outline" onClick={() => setShowReportForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reports List */}
      <div className="space-y-4">
        {reports.map((report) => (
          <Card key={report.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Badge className={getTypeBadge(report.type)}>
                    {getTypeLabel(report.type)}
                  </Badge>
                  {report.verified && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      Verified
                    </Badge>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">{report.timestamp}</span>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{report.location}</h3>
                <p className="text-gray-600">{report.description}</p>
              </div>
              
              <div className="flex items-center justify-between mt-4 pt-3 border-t">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm">
                    👍 Helpful ({report.votes})
                  </Button>
                  <Button variant="ghost" size="sm">
                    📍 More Info
                  </Button>
                </div>
                <Button variant="ghost" size="sm" className="text-blue-600">
                  View on Map
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Community Stats */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">Community Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">247</div>
              <div className="text-sm text-green-700">Reports This Month</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">89%</div>
              <div className="text-sm text-blue-700">Verified Reports</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">1,423</div>
              <div className="text-sm text-purple-700">Active Contributors</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">34</div>
              <div className="text-sm text-orange-700">Safety Improvements</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityReports;
