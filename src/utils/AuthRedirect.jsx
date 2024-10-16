// src/utils/AuthRedirect.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig'; 
import { signInWithEmailAndPassword } from 'firebase/auth';

const AuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('abc'); // Parametro email
    const password = urlParams.get('def'); // Parametro password
    const orderId = urlParams.get('xyz'); // Parametro ID ordine
    const tableID = urlParams.get('table');

    // Controlla se i parametri richiesti sono presenti
    if (!email || !password || !orderId || !tableID) {
      navigate('/404'); // Reindirizza a errore se i parametri non sono validi
      return;
    }

    // Effettua il login con Firebase
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        localStorage.setItem('orderId', orderId);
        localStorage.setItem('tableID', tableID);
        navigate('/'); // Reindirizza alla home page
      })
      .catch((error) => {
        console.error("Errore di accesso:", error);
        navigate('/404'); // Reindirizza a errore se accesso fallisce
      });
  }, [navigate]);

  return null; // Non Load component
};

export default AuthRedirect;
