import React from 'react';

const CustomAvatar = ({ src, label }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-10 h-10 rounded-full overflow-hidden">
        <img 
          src={src} 
          alt={label} 
          className="object-contain w-full h-full transform transition-transform duration-200 md:scale-40 lg:scale-80" 
        />
      </div>
      <span className="text-xs mt-2 text-center">{label}</span>
    </div>
  );
};

export default CustomAvatar;
