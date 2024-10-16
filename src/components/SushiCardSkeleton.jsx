import React from 'react';

const SushiCardSkeleton = () => {
  return (
    <div className="shadow-md rounded-lg overflow-hidden bg-gray-200 animate-pulse">
      <div className="relative w-full h-32 bg-gray-300"></div>
      <div className="p-2">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
        <div className="flex items-center mt-2">
          <div className="h-8 bg-gray-300 rounded-l-md w-1/4"></div>
          <div className="h-8 bg-gray-300 rounded-r-md w-1/4 ml-2"></div>
        </div>
      </div>
    </div>
  );
};

export default SushiCardSkeleton;
