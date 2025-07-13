
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, AlertTriangle, Shield, Clock, Users, Camera, Phone } from 'lucide-react';

interface DelhiRoute {
  id: string;
  from: string;
  to: string;
  area: string;
  duration: string;
  distance: string;
  safetyScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  policeStations: number;
  cctv: number;
  streetLights: number;
  crowdDensity: 'low' | 'medium' | 'high';
  emergencyServices: string[];
  riskFactors: string[];
  safetyFeatures: string[];
  timeRestrictions: string[];
  alternativeRoutes: number;
}

const DelhiRoutes = () => {
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string>('central');

  const delhiRoutes: Record<string, DelhiRoute[]> = {
    central: [
      {
        id: 'cp-to-cgp',
        from: 'Connaught Place',
        to: 'Central Government Offices',
        area: 'Central Delhi',
        duration: '15 min',
        distance: '3.2 km',
        safetyScore: 92,
        riskLevel: 'low',
        policeStations: 4,
        cctv: 85,
        streetLights: 95,
        crowdDensity: 'high',
        emergencyServices: ['Police PCR', 'Fire Station', 'Hospital'],
        riskFactors: ['Heavy traffic during peak hours'],
        safetyFeatures: ['24/7 Police Patrol', 'Metro connectivity', 'Well-lit streets', 'High foot traffic'],
        timeRestrictions: ['Avoid 11 PM - 5 AM for solo travel'],
        alternativeRoutes: 3
      },
      {
        id: 'igi-to-cp',
        from: 'IGI Airport',
        to: 'Connaught Place',
        area: 'Central Delhi',
        duration: '45 min',
        distance: '16.8 km',
        safetyScore: 78,
        riskLevel: 'medium',
        policeStations: 6,
        cctv: 70,
        streetLights: 88,
        crowdDensity: 'medium',
        emergencyServices: ['Police PCR', 'Fire Station', 'CATS Ambulance'],
        riskFactors: ['Some isolated stretches', 'Highway sections', 'Late night reduced visibility'],
        safetyFeatures: ['Airport Express Metro', 'Highway patrol', 'Tourist police presence'],
        timeRestrictions: ['High caution after 10 PM'],
        alternativeRoutes: 4
      }
    ],
    south: [
      {
        id: 'dlf-to-gk',
        from: 'DLF Cyber City',
        to: 'Greater Kailash',
        area: 'South Delhi',
        duration: '25 min',
        distance: '8.5 km',
        safetyScore: 88,
        riskLevel: 'low',
        policeStations: 3,
        cctv: 92,
        streetLights: 96,
        crowdDensity: 'high',
        emergencyServices: ['Police PCR', 'Private Security', 'Corporate Medical'],
        riskFactors: ['Traffic congestion'],
        safetyFeatures: ['Corporate security', 'Upscale area', 'Metro connectivity', 'Shopping malls'],
        timeRestrictions: ['Generally safe 24/7'],
        alternativeRoutes: 5
      },
      {
        id: 'hauz-to-safdar',
        from: 'Hauz Khas Village',
        to: 'Safdarjung',
        area: 'South Delhi',
        duration: '18 min',
        distance: '4.7 km',
        safetyScore: 75,
        riskLevel: 'medium',
        policeStations: 2,
        cctv: 65,
        streetLights: 82,
        crowdDensity: 'medium',
        emergencyServices: ['Police PCR', 'AIIMS Emergency'],
        riskFactors: ['Nightlife area crowds', 'Parking issues', 'Some narrow lanes'],
        safetyFeatures: ['Tourist police', 'Restaurant strips', 'University area'],
        timeRestrictions: ['Extra caution on weekends after 11 PM'],
        alternativeRoutes: 3
      }
    ],
    north: [
      {
        id: 'majnu-to-isbt',
        from: 'Majnu Ka Tilla',
        to: 'ISBT Kashmere Gate',
        area: 'North Delhi',
        duration: '22 min',
        distance: '6.1 km',
        safetyScore: 68,
        riskLevel: 'medium',
        policeStations: 3,
        cctv: 55,
        streetLights: 75,
        crowdDensity: 'high',
        emergencyServices: ['Police PCR', 'GTB Hospital'],
        riskFactors: ['Crowded bus terminal', 'Pickpocket incidents', 'Traffic chaos'],
        safetyFeatures: ['Transit police', 'Bus terminal security', 'Multiple escape routes'],
        timeRestrictions: ['Avoid late night travel'],
        alternativeRoutes: 2
      },
      {
        id: 'civil-to-kamla',
        from: 'Civil Lines',
        to: 'Kamla Nagar',
        area: 'North Delhi',
        duration: '20 min',
        distance: '5.3 km',
        safetyScore: 82,
        riskLevel: 'low',
        policeStations: 4,
        cctv: 78,
        streetLights: 89,
        crowdDensity: 'medium',
        emergencyServices: ['Police PCR', 'Hindu Rao Hospital'],
        riskFactors: ['Student area crowds'],
        safetyFeatures: ['University area', 'Regular police patrol', 'Commercial activity'],
        timeRestrictions: ['Generally safe till midnight'],
        alternativeRoutes: 4
      }
    ],
    east: [
      {
        id: 'akshardham-to-laxmi',
        from: 'Akshardham',
        to: 'Laxmi Nagar',
        area: 'East Delhi',
        duration: '30 min',
        distance: '12.4 km',
        safetyScore: 65,
        riskLevel: 'high',
        policeStations: 2,
        cctv: 45,
        streetLights: 68,
        crowdDensity: 'low',
        emergencyServices: ['Police PCR', 'Local Clinic'],
        riskFactors: ['Industrial area', 'Isolated stretches', 'Poor lighting in sections', 'Vehicle theft reports'],
        safetyFeatures: ['Temple security', 'Main road connectivity'],
        timeRestrictions: ['Avoid after 9 PM', 'Daylight travel recommended'],
        alternativeRoutes: 2
      }
    ]
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-amber-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getSafetyBadge = (score: number) => {
    if (score >= 85) return 'bg-green-100 text-green-800';
    if (score >= 70) return 'bg-amber-100 text-amber-800';
    return 'bg-red-100 text-red-800';
  };

  const getCrowdIcon = (density: string) => {
    switch (density) {
      case 'high': return '👥👥👥';
      case 'medium': return '👥👥';
      case 'low': return '👥';
      default: return '';
    }
  };

  const selectedRouteData = selectedRoute ? 
    Object.values(delhiRoutes).flat().find(route => route.id === selectedRoute) : null;

  return (
    <div className="space-y-6">
      {/* Delhi Area Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Delhi Route Safety Navigator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedArea} onValueChange={setSelectedArea}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="central">Central Delhi</TabsTrigger>
              <TabsTrigger value="south">South Delhi</TabsTrigger>
              <TabsTrigger value="north">North Delhi</TabsTrigger>
              <TabsTrigger value="east">East Delhi</TabsTrigger>
            </TabsList>
            
            {Object.entries(delhiRoutes).map(([area, routes]) => (
              <TabsContent key={area} value={area} className="space-y-4 mt-6">
                <div className="grid gap-4">
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
                          <div>
                            <CardTitle className="text-lg">{route.from} → {route.to}</CardTitle>
                            <p className="text-sm text-muted-foreground">{route.area}</p>
                          </div>
                          <Badge className={getSafetyBadge(route.safetyScore)}>
                            Safety: {route.safetyScore}/100
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Route Stats */}
                        <div className="grid grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-xl font-bold text-blue-600">{route.duration}</div>
                            <div className="text-xs text-muted-foreground">Duration</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl font-bold text-gray-600">{route.distance}</div>
                            <div className="text-xs text-muted-foreground">Distance</div>
                          </div>
                          <div className="text-center">
                            <div className={`text-xl font-bold ${getRiskColor(route.riskLevel)}`}>
                              {route.riskLevel.toUpperCase()}
                            </div>
                            <div className="text-xs text-muted-foreground">Risk Level</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl">{getCrowdIcon(route.crowdDensity)}</div>
                            <div className="text-xs text-muted-foreground">Crowd</div>
                          </div>
                        </div>

                        {/* Safety Infrastructure */}
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-blue-600" />
                            <span>{route.policeStations} Police Stations</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Camera className="w-4 h-4 text-green-600" />
                            <span>{route.cctv}% CCTV Coverage</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-4 h-4 text-amber-600">💡</span>
                            <span>{route.streetLights}% Lighting</span>
                          </div>
                        </div>

                        <Button 
                          className="w-full"
                          variant={route.riskLevel === 'low' ? 'default' : 'outline'}
                        >
                          {route.riskLevel === 'low' ? 'Recommended Route' : 'View Details'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Detailed Route Information */}
      {selectedRouteData && (
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Route Risk Assessment: {selectedRouteData.from} → {selectedRouteData.to}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Emergency Services */}
            <div>
              <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Emergency Services Available
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedRouteData.emergencyServices.map((service, index) => (
                  <Badge key={index} className="bg-green-50 text-green-700">
                    {service}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Safety Features */}
            <div>
              <h4 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Safety Features
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedRouteData.safetyFeatures.map((feature, index) => (
                  <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Risk Factors */}
            {selectedRouteData.riskFactors.length > 0 && (
              <div>
                <h4 className="font-semibold text-amber-700 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Risk Factors
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedRouteData.riskFactors.map((risk, index) => (
                    <Badge key={index} variant="outline" className="bg-amber-50 text-amber-700">
                      {risk}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Time Restrictions */}
            <div>
              <h4 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Time Restrictions & Recommendations
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedRouteData.timeRestrictions.map((restriction, index) => (
                  <Badge key={index} variant="outline" className="bg-red-50 text-red-700">
                    {restriction}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Alternative Routes */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Alternative Routes Available</h4>
              <p className="text-blue-700">
                {selectedRouteData.alternativeRoutes} alternative safe routes are available for this destination. 
                Would you like to explore backup options?
              </p>
              <Button variant="outline" className="mt-3 bg-white">
                View Alternatives
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button className="w-full">
                Start Navigation
              </Button>
              <Button variant="outline" className="w-full">
                Share Route
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delhi Safety Statistics */}
      <Card className="bg-gradient-to-br from-blue-50 to-slate-50">
        <CardHeader>
          <CardTitle className="text-lg text-blue-800">Delhi Safety Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Police Stations</span>
              <span className="font-medium">178</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">CCTV Cameras</span>
              <span className="font-medium">2.8L+</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Emergency Response</span>
              <span className="font-medium">4.2 min</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Women Safety Patrol</span>
              <span className="font-medium">24/7</span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-white rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>🚨 Emergency Numbers:</strong> Police (100), Fire (101), Ambulance (102), Women Helpline (1091)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DelhiRoutes;
