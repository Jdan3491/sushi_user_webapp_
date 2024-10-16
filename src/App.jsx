import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import { AppProvider } from './AppContext'; 
import AuthRedirect from './utils/AuthRedirect';
import NotFound from './pages/NotFound'; 
import { auth } from './firebaseConfig'; 
import Loading from './components/Loading';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // State for authentication

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setIsAuthenticated(!!user); // Set true if the user is authenticated, false otherwise
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);


  // Block Drag and Drop
  useEffect(() => {
    const handleDragOver = (event) => {
      event.preventDefault();
    };

    const handleDrop = (event) => {
      event.preventDefault();
    };

    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('drop', handleDrop);

    // Prevent copy, cut, and paste
    const preventCopyCutPaste = (e) => e.preventDefault();

    document.addEventListener('copy', preventCopyCutPaste);
    document.addEventListener('cut', preventCopyCutPaste);
    document.addEventListener('paste', preventCopyCutPaste);

    return () => {
      document.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('drop', handleDrop);
      document.removeEventListener('copy', preventCopyCutPaste);
      document.removeEventListener('cut', preventCopyCutPaste);
      document.removeEventListener('paste', preventCopyCutPaste);
    };
  }, []);

  if (isAuthenticated === null) {
    return <Loading />
  }

  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/auth" element={<AuthRedirect />} />
          <Route path="/category/:category" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/auth" replace />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
