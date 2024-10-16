// src/pages/NotFound.js
import React from 'react';

const NotFound = () => {
  return (
    <>
      {/* Main container for the 404 Not Found message */}
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-8xl font-bold text-red-600">404</h1> {/* Displaying the 404 status code */}
        <h2 className="text-2xl font-semibold text-gray-800 mt-4">Pagina non valida</h2> {/* Message indicating page not found */}
        <p className="text-gray-600 mt-2 text-center max-w-md">
         Per favore riscansioni Qr Code fornito dal nostro servizio {/* Instruction for users */}
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mt-4">
         <strong>Chiudi Scheda pagina per un esperienza migliore!</strong>
        </h2>
      </div>
    </>
  );
};

export default NotFound; // Export the NotFound component
