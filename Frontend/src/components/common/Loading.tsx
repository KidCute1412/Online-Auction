import React from 'react';
import { ShoppingBag } from 'lucide-react';
import avatar from '@/assets/images/avatar.png';
import { cn } from "@/lib/utils";

interface LoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  showImage?: boolean;
  image?: string;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  message = "Loading...",
  size = 'md',
  showImage = true,
  image,
  className = '',
}) => {
  const sizeClasses = {
    sm: {
      container: 'p-4',
      image: 'w-12 h-12',
      orbitRadius: 32
    },
    md: {
      container: 'p-8',
      image: 'w-16 h-16',
      orbitRadius: 42
    },
    lg: {
      container: 'p-12',
      image: 'w-24 h-24',
      orbitRadius: 58
    }
  };

  const currentSize = sizeClasses[size];
  const displayImage = image || avatar;

  return (
    <div className={cn("fixed inset-0 mt-16 lg:mt-20 bg-background/85 backdrop-blur-md flex items-center justify-center z-50 transition-colors duration-300", className)}>
      <div className={cn(currentSize.container, "rounded-2xl max-w-4xl mx-4 bg-card/50 border border-border shadow-gold-glow")}>
        <div className="flex flex-col items-center justify-center">
          {/* Main loader design */}
          {showImage && (
            <div className="relative flex-shrink-0">
              {displayImage ? (
                <div className={`${currentSize.image} p-1.5 rounded-full overflow-hidden border border-accent/20 shadow-gold-glow relative`}>
                  <img
                    src={displayImage}
                    alt="Loading"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              ) : (
                <div className={`${currentSize.image} bg-gradient-to-br from-accent to-accent/60 rounded-full flex items-center justify-center shadow-gold-glow relative`}>
                  <ShoppingBag className="w-8 h-8 text-primary-foreground" />
                </div>
              )}

              {/* Pulsing glow boundary */}
              <div className="absolute inset-0 rounded-full border border-accent animate-ping opacity-60"></div>

              {/* Orbiting technology dots */}
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-accent rounded-full shadow-sm"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: `translateX(-50%) translateY(-50%) rotate(${i * 90}deg) translateX(${currentSize.orbitRadius}px)`,
                    }}
                  ></div>
                ))}
              </div>
            </div>
          )}

          {/* Indicator text */}
          <div className="mt-6 flex flex-col items-center">
            <span className="text-sm font-heading font-semibold tracking-widest text-muted-foreground uppercase animate-pulse">
              {message}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;