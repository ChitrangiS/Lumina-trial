
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const OfflineMode = () => {
  const [isOfflineReady, setIsOfflineReady] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadOfflineData = () => {
    setIsDownloading(true);
    
    // Simulate download progress
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDownloading(false);
          setIsOfflineReady(true);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className={`${isOfflineReady ? "bg-green-50 border-green-500" : ""} text-black font-semibold`}
        >
          {isOfflineReady ? "📱 Offline Ready" : "📴 Offline Mode"}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Offline Safety Mode</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Download safety data for use when you have limited or no internet connectivity.
          </div>

          {/* Status */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">Offline Data Status</span>
                <Badge className={isOfflineReady ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}>
                  {isOfflineReady ? "Ready" : "Not Downloaded"}
                </Badge>
              </div>
              
              {isOfflineReady && (
                <div className="text-sm text-green-600">
                  ✓ Last updated: 2 hours ago
                </div>
              )}
            </CardContent>
          </Card>

          {/* What gets downloaded */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Offline Package Includes:</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Safe routes for your frequent destinations</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Emergency contact information</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Critical safety zones and alerts</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Local emergency services numbers</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Basic map data for navigation</span>
              </div>
            </CardContent>
          </Card>

          {/* Download Progress */}
          {isDownloading && (
            <Card className="border-blue-200 bg-blue-50 animate-slide-up">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Downloading safety data...</span>
                    <span>{downloadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${downloadProgress}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {!isOfflineReady && !isDownloading && (
              <Button 
                onClick={handleDownloadOfflineData}
                className="flex-1"
              >
                Download Offline Data
              </Button>
            )}
            
            {isOfflineReady && (
              <>
                <Button 
                  onClick={handleDownloadOfflineData}
                  variant="outline"
                  className="flex-1"
                >
                  Update Data
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => setIsOfflineReady(false)}
                >
                  Clear
                </Button>
              </>
            )}
          </div>

          <div className="text-xs text-muted-foreground bg-yellow-50 p-3 rounded border border-yellow-200">
            <strong>Note:</strong> Offline mode provides basic safety features but real-time updates require internet connectivity.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OfflineMode;
