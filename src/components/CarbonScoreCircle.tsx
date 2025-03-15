
import React from 'react';
import { cn } from '@/lib/utils';
import { CircleDot } from 'lucide-react';

interface CarbonScoreCircleProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const CarbonScoreCircle: React.FC<CarbonScoreCircleProps> = ({
  score,
  size = 'md',
  showLabel = true,
  className
}) => {
  // Determine color based on carbon score
  const getColor = (score: number) => {
    if (score < 5) return 'text-green-500 bg-green-50';
    if (score < 10) return 'text-amber-500 bg-amber-50';
    return 'text-red-500 bg-red-50';
  };

  // Size classes
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base'
  };

  const colorClass = getColor(score);

  return (
    <div className={cn('flex flex-col items-center gap-1', className)}>
      <div 
        className={cn(
          'rounded-full flex items-center justify-center font-semibold',
          colorClass,
          sizeClasses[size]
        )}
      >
        {score}
      </div>
      {showLabel && (
        <span className="text-xs text-gray-500">
          Carbon Score
        </span>
      )}
    </div>
  );
};

export default CarbonScoreCircle;
