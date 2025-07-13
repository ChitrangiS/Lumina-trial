
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';

interface Route {
  id: string;
  name: string;
  duration: string;
  distance: string;
  safetyScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  highlights: string[];
  warnings: string[];
}

interface RoutePanelProps {
  destination: string;
}

const RoutePanel = ({ destination }: RoutePanelProps) => {
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  const routes: Route[] = [
    {
      id: '1',
      name: 'Lumina Recommended',
      duration: '18 min',
      distance: '2.3 km',
      safetyScore: 94,
      riskLevel: 'low',
      highlights: ['Well-lit streets', 'High foot traffic', 'Security cameras'],
      warnings: []
    },
    {
      id: '2',
      name: 'Main Street Route',
      duration: '15 min',
      distance: '2.1 km',
      safetyScore: 78,
      riskLevel: 'medium',
      highlights: ['Faster route', 'Bus stops available'],
      warnings: ['Construction zone ahead', 'Lower lighting after 8pm']
    },
    {
      id: '3',
      name: 'Park Path',
      duration: '22 min',
      distance: '2.7 km',
      safetyScore: 65,
      riskLevel: 'high',
      highlights: ['Scenic route', 'Less traffic'],
      warnings: ['Isolated areas', 'Recent incidents reported', 'Avoid after dark']
    }
  ];

  const getSafetyBadge = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 70) return 'bg-amber-100 text-amber-800';
    return 'bg-red-100 text-red-800';
  };

  const getSafetyLabel = (score: number) => {
    if (score >= 90) return 'VERY SAFE';
    if (score >= 70) return 'MODERATE';
    return 'CAUTION';
  };

  return (
    <div className="space-y-6">
      {/* Destination Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Routes to: {destination || 'Select a destination'}
          </CardTitle>
        </CardHeader>
        {destination && (
          <CardContent>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Current time: 7:30 PM</span>
              <span>Weather: Clear</span>
              <span>AI Risk Analysis: Active</span>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Route Options */}
      <div className="space-y-4">
        {routes.map((route) => (
          <Card 
            key={route.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedRoute === route.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedRoute(route.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{route.name}</CardTitle>
                <Badge className={getSafetyBadge(route.safetyScore)}>
                  {getSafetyLabel(route.safetyScore)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Route Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{route.duration}</div>
                  <div className="text-sm text-muted-foreground">Duration</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">{route.distance}</div>
                  <div className="text-sm text-muted-foreground">Distance</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{route.safetyScore}</div>
                  <div className="text-sm text-muted-foreground">Safety Score</div>
                </div>
              </div>

              {/* Highlights */}
              {route.highlights.length > 0 && (
                <div>
                  <h4 className="font-medium text-green-700 mb-2">Safety Highlights:</h4>
                  <div className="flex flex-wrap gap-2">
                    {route.highlights.map((highlight, index) => (
                      <Badge key={index} variant="outline" className="bg-green-50 text-green-700">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Warnings */}
              {route.warnings.length > 0 && (
                <div>
                  <h4 className="font-medium text-amber-700 mb-2">Safety Warnings:</h4>
                  <div className="flex flex-wrap gap-2">
                    {route.warnings.map((warning, index) => (
                      <Badge key={index} variant="outline" className="bg-amber-50 text-amber-700">
                        {warning}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button 
                  className="flex-1"
                  variant={route.id === '1' ? 'default' : 'outline'}
                >
                  Select Route
                </Button>
                <Button variant="ghost" size="sm">
                  Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Insights */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg text-blue-800">🧠 AI Safety Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-blue-700">
          <p>• Based on current time (7:30 PM), the Lumina Recommended route has 23% better safety metrics</p>
          <p>• Recent community reports suggest avoiding the Park Path after sunset</p>
          <p>• Street lighting on Main Street Route is currently at 78% operational status</p>
          <p>• Emergency response time in this area averages 4.2 minutes</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoutePanel;
