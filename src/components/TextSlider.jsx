import React, { useEffect, useState } from 'react';

const TextSlider = ({ texts }) => {
  const [currentText, setCurrentText] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // Start fading out
      setTimeout(() => {
        setCurrentText((prevText) => (prevText + 1) % texts.length); // Change text
        setFade(true); // Start fading in
      }, 500); // Fade out duration
    }, 4000); // Change text every 4 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [texts.length]);

  return (
    <div className="absolute top-10 left-4 space-y-2">
      {texts.map((item, index) => (
        <div key={index} className={`transition-opacity duration-500 ${fade && currentText === index ? 'opacity-100' : 'opacity-0'}`}>
          {item.isH1 ? (
            <h1 className="text-white text-6xl font-bold text-center">{item.text}</h1>
          ) : (
            <h2 className="text-white text-4xl text-center">{item.text}</h2>
          )}
        </div>
      ))}
    </div>
  );
};

export default TextSlider;
