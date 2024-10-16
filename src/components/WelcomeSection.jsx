import React from 'react';

const WelcomeSection = ({ texts, chopsticksImage }) => {
  return (
    <div className="flex items-center justify-center h-full text-center relative">
      <img 
        src={chopsticksImage} 
        alt="Chopsticks" 
        className="w-auto h-full object-contain absolute left-0" 
        style={{ top: '-50px', zIndex: 10 }}
      />
      <h1 
        className="text-white text-5xl font-bold absolute left-4 top-1/2 transform -translate-y-1/2" 
        style={{ writingMode: 'vertical-rl', whiteSpace: 'nowrap', zIndex: 1 }}
      >
        <span className='text-8xl my-2'>日</span>
        <span className='text-8xl my-2'>本</span>
        <span className='text-8xl my-2'>食</span>
      </h1>
    </div>
  );
};

export default WelcomeSection;
