import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, DirectionsRenderer, Marker, InfoWindow } from '@react-google-maps/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, AlertTriangle, Shield } from 'lucide-react';

interface SafetyZone {
  id: string;
  name: string;
  riskLevel: 'low' | 'medium' | 'high';
  incidents: number;
  lastUpdated: string;
  lat: number;
  lng: number;
}

interface RoutePoint {
  lat: number;
  lng: number;
  name: string;
}

interface GoogleMapComponentProps {
  origin?: RoutePoint;
  destination?: RoutePoint;
  waypoints?: RoutePoint[];
  showDirections?: boolean;
  className?: string;
}

const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = ["places", "geometry"];

// Default center - Delhi, India (suitable for Lumina safety app)
const defaultCenter = {
  lat: 28.6139,
  lng: 77.2090
};

// Sample safety zones for demonstration
const safetyZones: SafetyZone[] = [
  { id: '1', name: 'Connaught Place', riskLevel: 'low', incidents: 2, lastUpdated: '5 min ago', lat: 28.6315, lng: 77.2167 },
  { id: '2', name: 'Karol Bagh', riskLevel: 'low', incidents: 1, lastUpdated: '12 min ago', lat: 28.6519, lng: 77.1909 },
  { id: '3', name: 'Lajpat Nagar', riskLevel: 'medium', incidents: 8, lastUpdated: '3 min ago', lat: 28.5665, lng: 77.2431 },
  { id: '4', name: 'Paharganj', riskLevel: 'high', incidents: 15, lastUpdated: '1 min ago', lat: 28.6433, lng: 77.2167 },
  { id: '5', name: 'Khan Market', riskLevel: 'low', incidents: 0, lastUpdated: '8 min ago', lat: 28.5984, lng: 77.2319 },
  { id: '6', name: 'Chandni Chowk', riskLevel: 'medium', incidents: 4, lastUpdated: '6 min ago', lat: 28.6506, lng: 77.2301 }
];

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({
  origin,
  destination,
  waypoints = [],
  showDirections = false,
  className = "h-96"
}) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY!,
    libraries: libraries,
    version: "weekly"
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);
  const [selectedZone, setSelectedZone] = useState<SafetyZone | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const mapRef = useRef<GoogleMap>(null);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Could not get user location:', error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    }
  }, []);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Calculate and display directions
  const calculateRoute = useCallback(async () => {
    if (!origin || !destination || !window.google) return;

    setLoading(true);
    try {
      const directionsService = new window.google.maps.DirectionsService();
      
      const waypts = waypoints.map(point => ({
        location: { lat: point.lat, lng: point.lng },
        stopover: true
      }));

      const result = await directionsService.route({
        origin: { lat: origin.lat, lng: origin.lng },
        destination: { lat: destination.lat, lng: destination.lng },
        waypoints: waypts,
        travelMode: window.google.maps.TravelMode.DRIVING,
        avoidHighways: false,
        avoidTolls: false,
        optimizeWaypoints: true,
      });

      setDirectionsResponse(result);
    } catch (error) {
      console.error('Error calculating route:', error);
    } finally {
      setLoading(false);
    }
  }, [origin, destination, waypoints]);

  useEffect(() => {
    if (showDirections && origin && destination && isLoaded) {
      calculateRoute();
    }
  }, [showDirections, origin, destination, isLoaded, calculateRoute]);

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return '/api/placeholder/32/32'; // Green shield icon
      case 'medium':
        return '/api/placeholder/32/32'; // Yellow warning icon
      case 'high':
        return '/api/placeholder/32/32'; // Red alert icon
      default:
        return '/api/placeholder/32/32';
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return '#10B981'; // green-500
      case 'medium':
        return '#F59E0B'; // yellow-500
      case 'high':
        return '#EF4444'; // red-500
      default:
        return '#6B7280'; // gray-500
    }
  };

  if (loadError) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center text-red-600">
            <AlertTriangle className="w-12 h-12 mx-auto mb-2" />
            <p>Error loading Google Maps</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isLoaded) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p>Loading Google Maps...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const mapOptions: google.maps.MapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: true,
    gestureHandling: 'greedy',
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
      }
    ]
  };

  return (
    <div className={`relative ${className} w-full`}>
      <GoogleMap
        ref={mapRef}
        mapContainerClassName="w-full h-full rounded-lg"
        center={userLocation || defaultCenter}
        zoom={userLocation ? 14 : 11}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
      >
        {/* User's current location */}
        {userLocation && (
          <Marker
            position={userLocation}
            title="Your Location"
            icon={{
              url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="8" fill="#3B82F6" stroke="white" stroke-width="3"/>
                  <circle cx="16" cy="16" r="3" fill="white"/>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(32, 32),
              anchor: new window.google.maps.Point(16, 16),
            }}
          />
        )}

        {/* Safety zone markers */}
        {safetyZones.map((zone) => (
          <Marker
            key={zone.id}
            position={{ lat: zone.lat, lng: zone.lng }}
            title={zone.name}
            onClick={() => setSelectedZone(zone)}
            icon={{
              url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="18" fill="${getRiskColor(zone.riskLevel)}" stroke="white" stroke-width="3"/>
                  <text x="20" y="26" text-anchor="middle" fill="white" font-size="12" font-weight="bold">${zone.incidents}</text>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(40, 40),
              anchor: new window.google.maps.Point(20, 20),
            }}
          />
        ))}

        {/* Origin marker */}
        {origin && (
          <Marker
            position={{ lat: origin.lat, lng: origin.lng }}
            title={`Origin: ${origin.name}`}
            icon={{
              url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="12" fill="#10B981" stroke="white" stroke-width="3"/>
                  <path d="M16 8L20 16L16 24L12 16Z" fill="white"/>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(32, 32),
              anchor: new window.google.maps.Point(16, 16),
            }}
          />
        )}

        {/* Destination marker */}
        {destination && (
          <Marker
            position={{ lat: destination.lat, lng: destination.lng }}
            title={`Destination: ${destination.name}`}
            icon={{
              url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="12" fill="#EF4444" stroke="white" stroke-width="3"/>
                  <rect x="12" y="12" width="8" height="8" fill="white"/>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(32, 32),
              anchor: new window.google.maps.Point(16, 16),
            }}
          />
        )}

        {/* Directions renderer */}
        {directionsResponse && (
          <DirectionsRenderer
            directions={directionsResponse}
            options={{
              suppressMarkers: true, // We're using custom markers
              polylineOptions: {
                strokeColor: '#7C3AED',
                strokeWeight: 6,
                strokeOpacity: 0.8,
              },
            }}
          />
        )}

        {/* Info window for selected safety zone */}
        {selectedZone && (
          <InfoWindow
            position={{ lat: selectedZone.lat, lng: selectedZone.lng }}
            onCloseClick={() => setSelectedZone(null)}
          >
            <div className="p-2 min-w-[200px]">
              <h3 className="font-bold text-lg mb-2">{selectedZone.name}</h3>
              <div className="space-y-2">
                <Badge 
                  className={`${
                    selectedZone.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                    selectedZone.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}
                >
                  {selectedZone.riskLevel.toUpperCase()} RISK
                </Badge>
                <p className="text-sm">
                  <strong>Incidents:</strong> {selectedZone.incidents}
                </p>
                <p className="text-sm">
                  <strong>Updated:</strong> {selectedZone.lastUpdated}
                </p>
                {selectedZone.riskLevel === 'high' && (
                  <Button size="sm" variant="destructive" className="w-full">
                    Avoid This Area
                  </Button>
                )}
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="animate-spin w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-sm">Calculating safe route...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleMapComponent;