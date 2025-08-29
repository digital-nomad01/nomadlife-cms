import React from 'react';
import { getAmenityConfig } from '../domain/amenity-config';

interface AmenityItemProps {
  amenityName: string;
  showDescription?: boolean;
  className?: string;
}

export const AmenityItem: React.FC<AmenityItemProps> = ({ 
  amenityName, 
  showDescription = true,
  className = "" 
}) => {
  const config = getAmenityConfig(amenityName);
  
  if (!config) {
    return <span className="text-gray-500">{amenityName}</span>;
  }

  const IconComponent = config.icon;

  return (
    <div className={`flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-100 ${className}`}>
      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-red-500">
        <IconComponent size={20} />
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{config.label}</h3>
        {showDescription && (
          <p className="text-sm text-gray-600 mt-1">{config.description}</p>
        )}
      </div>
    </div>
  );
};

interface AmenityListProps {
  amenities: string[];
  showDescriptions?: boolean;
  className?: string;
  gridCols?: number;
}

export const AmenityList: React.FC<AmenityListProps> = ({ 
  amenities, 
  showDescriptions = true,
  className = "",
  gridCols = 1
}) => {
  const gridClass = gridCols > 1 ? `grid grid-cols-${gridCols} gap-4` : "space-y-4";
  
  return (
    <div className={`${gridClass} ${className}`}>
      {amenities.map((amenity) => (
        <AmenityItem 
          key={amenity} 
          amenityName={amenity} 
          showDescription={showDescriptions}
        />
      ))}
    </div>
  );
};

// Compact version for forms/cards
export const AmenityBadge: React.FC<{ amenityName: string }> = ({ amenityName }) => {
  const config = getAmenityConfig(amenityName);
  
  if (!config) {
    return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">{amenityName}</span>;
  }

  const IconComponent = config.icon;

  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 rounded text-sm">
      <IconComponent size={14} />
      {config.label}
    </span>
  );
};

