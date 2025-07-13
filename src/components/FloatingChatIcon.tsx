
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FloatingChatIconProps {
  onClick: () => void;
  isActive: boolean;
}

const FloatingChatIcon = ({ onClick, isActive }: FloatingChatIconProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    console.log('Floating chat icon clicked!', { isActive });
    onClick();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        {/* Notification badge */}
        {!isActive && (
          <Badge 
            className="absolute -top-2 -right-2 bg-red-500 text-white animate-pulse z-10 pointer-events-none font-bold"
            variant="destructive"
          >
            AI
          </Badge>
        )}
        
        {/* Main chat button */}
        <Button
          onClick={handleClick}
          className={`w-14 h-14 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer font-bold ${
            isActive 
              ? 'emergency-gradient hover:scale-110' 
              : 'safety-gradient hover:scale-110 animate-glow'
          } ${isHovered ? 'scale-110' : 'scale-100'}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          type="button"
        >
          {isActive ? (
            <Shield className="w-6 h-6 text-white" />
          ) : (
            <MessageCircle className="w-6 h-6 text-white" />
          )}
        </Button>

        {/* Floating tooltip */}
        {isHovered && !isActive && (
          <div className="absolute bottom-16 right-0 bg-purple-800 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap animate-slide-up pointer-events-none font-medium shadow-xl">
            Need help? Chat with Lumina AI
            <div className="absolute top-full right-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-purple-800"></div>
          </div>
        )}

        {/* Pulsing ring animation when not active */}
        {!isActive && (
          <div className="absolute inset-0 rounded-full border-2 border-purple-400 animate-ping opacity-40 pointer-events-none"></div>
        )}
      </div>
    </div>
  );
};

export default FloatingChatIcon;
