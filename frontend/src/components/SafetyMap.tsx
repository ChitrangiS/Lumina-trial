
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

interface SafetyZone {
  id: string;
  name: string;
  riskLevel: 'low' | 'medium' | 'high';
  incidents: number;
  lastUpdated: string;
}

const SafetyMap = () => {
  const [selectedZone, setSelectedZone] = useState<SafetyZone | null>(null);

  const safetyZones: SafetyZone[] = [
    { id: '1', name: 'Downtown Core', riskLevel: 'low', incidents: 2, lastUpdated: '5 min ago' },
    { id: '2', name: 'University District', riskLevel: 'low', incidents: 1, lastUpdated: '12 min ago' },
    { id: '3', name: 'Industrial Area', riskLevel: 'medium', incidents: 8, lastUpdated: '3 min ago' },
    { id: '4', name: 'Riverside Park', riskLevel: 'high', incidents: 15, lastUpdated: '1 min ago' },
    { id: '5', name: 'Shopping Center', riskLevel: 'low', incidents: 0, lastUpdated: '8 min ago' },
    { id: '6', name: 'Transit Hub', riskLevel: 'medium', incidents: 4, lastUpdated: '6 min ago' }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'zone-safe';
      case 'medium': return 'zone-moderate';
      case 'high': return 'zone-danger';
      default: return 'bg-gray-500';
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Map Visualization */}
      <div className="lg:col-span-2">
        <Card className="h-96 border-2 border-empowerment-violet/30">
          <CardHeader className="empowerment-gradient text-white">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Live Safety Heatmap
              <Badge variant="outline" className="ml-auto bg-white/20 text-white border-white/30">Real-time</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative h-64 bg-gradient-to-br from-empowerment-violet/5 to-careful-pink/10 overflow-hidden">
              {/* Simulated Map with 3x2 Grid Layout */}
              <div className="absolute inset-0 p-4">
                <div className="grid grid-cols-3 grid-rows-2 gap-2 h-full">
                  {/* Top Row - 3 zones */}
                  {safetyZones.slice(0, 3).map((zone, index) => (
                    <div
                      key={zone.id}
                      className={`relative rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg ${getRiskColor(zone.riskLevel)} opacity-80 hover:opacity-95`}
                      onClick={() => setSelectedZone(zone)}
                    >
                      <div className="absolute inset-2 bg-white/25 rounded flex items-center justify-center backdrop-blur-sm">
                        <div className="text-center text-white text-sm font-medium drop-shadow-lg">
                          <div className="text-xs opacity-90 font-semibold">{zone.name}</div>
                          <div className="text-lg font-bold">{zone.incidents}</div>
                          <div className="text-xs opacity-75">incidents</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Bottom Row - 3 zones */}
                  {safetyZones.slice(3, 6).map((zone, index) => (
                    <div
                      key={zone.id}
                      className={`relative rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg ${getRiskColor(zone.riskLevel)} opacity-80 hover:opacity-95`}
                      onClick={() => setSelectedZone(zone)}
                    >
                      <div className="absolute inset-2 bg-white/25 rounded flex items-center justify-center backdrop-blur-sm">
                        <div className="text-center text-white text-sm font-medium drop-shadow-lg">
                          <div className="text-xs opacity-90 font-semibold">{zone.name}</div>
                          <div className="text-lg font-bold">{zone.incidents}</div>
                          <div className="text-xs opacity-75">incidents</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Legend - Moved down to avoid covering riverside park */}
              <div className="absolute bottom-2 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-empowerment-violet/20">
                <div className="text-xs font-semibold mb-2 text-empowerment-violet">Risk Level</div>
                <div className="flex gap-3">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 zone-safe rounded"></div>
                    <span className="text-xs font-medium">Safe</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 zone-moderate rounded"></div>
                    <span className="text-xs font-medium">Moderate</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 zone-danger rounded"></div>
                    <span className="text-xs font-medium">High Risk</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Zone Details */}
      <div className="space-y-4">
        <Card className="border-2 border-purple-200">
          <CardHeader className="safety-gradient text-white">
            <CardTitle className="text-lg">Zone Details</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {selectedZone ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-lg text-purple-800">{selectedZone.name}</h3>
                  <Badge className={`${getRiskBadge(selectedZone.riskLevel)} font-semibold`}>
                    {selectedZone.riskLevel.toUpperCase()} RISK
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-medium">Active Incidents:</span>
                    <span className="font-bold text-lg text-purple-700">{selectedZone.incidents}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-medium">Last Updated:</span>
                    <span className="font-semibold text-purple-600">{selectedZone.lastUpdated}</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400 font-semibold">
                  Avoid This Area
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50 text-purple-400" />
                <p className="font-medium">Click on a zone to view details</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
          <CardHeader className="safety-gradient text-white">
            <CardTitle className="text-lg">City Safety Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-6">
            <div className="flex justify-between items-center">
              <span className="text-purple-700 font-medium">Overall Safety Score</span>
              <Badge className="bg-green-500 text-white font-bold text-sm px-3 py-1">87/100</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-purple-700 font-medium">Active Incidents</span>
              <span className="font-bold text-lg text-purple-800">30</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-purple-700 font-medium">Safe Routes Available</span>
              <span className="font-bold text-lg text-purple-800">142</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-purple-700 font-medium">Community Reports</span>
              <span className="font-bold text-lg text-purple-800">68 today</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SafetyMap;
