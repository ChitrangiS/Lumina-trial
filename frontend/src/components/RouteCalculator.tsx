import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Navigation, MapPin, Clock, Route, Shield, AlertTriangle } from 'lucide-react';
import GoogleMapComponent from './GoogleMap';

interface RoutePoint {
  lat: number;
  lng: number;
  name: string;
}

interface RouteInfo {
  distance: string;
  duration: string;
  safetyScore: number;
  alternativeRoutes: number;
}

const RouteCalculator: React.FC = () => {
  const [origin, setOrigin] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [originPoint, setOriginPoint] = useState<RoutePoint | null>(null);
  const [destinationPoint, setDestinationPoint] = useState<RoutePoint | null>(null);
  const [showDirections, setShowDirections] = useState(false);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [loading, setLoading] = useState(false);

  // Sample route data - in real app, this would come from your backend
  const sampleRouteInfo: RouteInfo = {
    distance: '12.5 km',
    duration: '28 mins',
    safetyScore: 87,
    alternativeRoutes: 3
  };

  // Geocoding service to convert addresses to coordinates
  const geocodeAddress = useCallback(async (address: string): Promise<RoutePoint | null> => {
    if (!window.google || !address.trim()) return null;

    try {
      const geocoder = new window.google.maps.Geocoder();
      const result = await geocoder.geocode({ address });
      
      if (result.results && result.results.length > 0) {
        const location = result.results[0].geometry.location;
        return {
          lat: location.lat(),
          lng: location.lng(),
          name: result.results[0].formatted_address
        };
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
    return null;
  }, []);

  const handleCalculateRoute = async () => {
    if (!origin.trim() || !destination.trim()) {
      alert('Please enter both origin and destination');
      return;
    }

    setLoading(true);
    try {
      // Geocode origin and destination
      const [originCoords, destCoords] = await Promise.all([
        geocodeAddress(origin),
        geocodeAddress(destination)
      ]);

      if (!originCoords || !destCoords) {
        alert('Could not find one or both locations. Please try different addresses.');
        return;
      }

      setOriginPoint(originCoords);
      setDestinationPoint(destCoords);
      setShowDirections(true);
      setRouteInfo(sampleRouteInfo);
    } catch (error) {
      console.error('Route calculation error:', error);
      alert('Error calculating route. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearRoute = () => {
    setOriginPoint(null);
    setDestinationPoint(null);
    setShowDirections(false);
    setRouteInfo(null);
    setOrigin('');
    setDestination('');
  };

  const getSafetyBadge = (score: number) => {
    if (score >= 80) return { text: 'SAFE ROUTE', className: 'bg-green-100 text-green-800 border-green-300' };
    if (score >= 60) return { text: 'MODERATE RISK', className: 'bg-yellow-100 text-yellow-800 border-yellow-300' };
    return { text: 'HIGH RISK', className: 'bg-red-100 text-red-800 border-red-300' };
  };

  return (
    <div className="space-y-6">
      {/* Route Input */}
      <Card className="border-2 border-purple-200">
        <CardHeader className="safety-gradient text-white">
          <CardTitle className="flex items-center gap-2">
            <Navigation className="w-5 h-5" />
            Route Calculator
            <Badge variant="outline" className="ml-auto bg-white/20 text-white border-white/30">
              AI-Powered
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-700">
                <MapPin className="w-4 h-4 inline mr-1" />
                From (Origin)
              </label>
              <Input
                placeholder="Enter starting location..."
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="border-purple-200 focus:border-purple-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-700">
                <Route className="w-4 h-4 inline mr-1" />
                To (Destination)
              </label>
              <Input
                placeholder="Enter destination..."
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="border-purple-200 focus:border-purple-500"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleCalculateRoute}
              disabled={loading || !origin.trim() || !destination.trim()}
              className="cta-button text-white font-semibold flex-1"
            >
              {loading ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Calculating...
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4 mr-2" />
                  Calculate Safe Route
                </>
              )}
            </Button>
            
            {showDirections && (
              <Button
                onClick={handleClearRoute}
                variant="outline"
                className="border-purple-300 text-purple-700"
              >
                Clear Route
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Route Information */}
      {routeInfo && (
        <Card className="border-2 border-purple-200">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Shield className="w-5 h-5" />
              Route Analysis
              {(() => {
                const badge = getSafetyBadge(routeInfo.safetyScore);
                return (
                  <Badge className={`ml-auto ${badge.className} font-semibold`}>
                    {badge.text}
                  </Badge>
                );
              })()}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Route className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <div className="font-bold text-lg text-purple-800">{routeInfo.distance}</div>
                <div className="text-sm text-purple-600">Distance</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Clock className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <div className="font-bold text-lg text-purple-800">{routeInfo.duration}</div>
                <div className="text-sm text-purple-600">Duration</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Shield className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <div className="font-bold text-lg text-purple-800">{routeInfo.safetyScore}/100</div>
                <div className="text-sm text-purple-600">Safety Score</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Navigation className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <div className="font-bold text-lg text-purple-800">{routeInfo.alternativeRoutes}</div>
                <div className="text-sm text-purple-600">Alternatives</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Google Map */}
      <Card className="border-2 border-purple-200">
        <CardHeader className="safety-gradient text-white">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Interactive Safety Map
            <Badge variant="outline" className="ml-auto bg-white/20 text-white border-white/30">
              Real-time
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <GoogleMapComponent
            origin={originPoint || undefined}
            destination={destinationPoint || undefined}
            showDirections={showDirections}
            className="h-96"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default RouteCalculator;