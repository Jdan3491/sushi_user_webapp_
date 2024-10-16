import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import { db } from '../firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';
import { FaStar, FaFish, FaBreadSlice } from 'react-icons/fa';

const storageBaseUrl = import.meta.env.VITE_SUSHI_FIREBASE_STORAGE_URL;
const altParam = import.meta.env.VITE_SUSHI_ALT_PARAM;

const getImageUrl = (imagePath) => {
  const encodedImagePath = imagePath || 'default_image.png';
  return `${storageBaseUrl}${encodeURIComponent(encodedImagePath)}${altParam}`;
};

const allergenIcons = {
  Pesce: { icon: <FaFish className="text-blue-500 mr-1" />, color: 'text-blue-500' },
  Glutine: { icon: <FaBreadSlice className="text-brown-500 mr-1" />, color: 'text-brown-500' },
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [imageLoading, setImageLoading] = useState({});

  useEffect(() => {
    document.body.style.overflow = 'auto';

    const unsubscribe = onSnapshot(
      doc(db, 'products', id),
      (doc) => {
        if (doc.exists()) {
          setProduct({ id: doc.id, ...doc.data() });
          setLoading(false);
        } else {
          setError('Prodotto non trovato. Controlla l\'ID o riprova più tardi.');
          setLoading(false);
        }
      },
      (error) => {
        console.error('Errore durante il recupero dei dettagli:', error);
        setError('Errore durante il recupero dei dettagli. Riprova più tardi.');
        setLoading(false);
      }
    );

    return () => {
      document.body.style.overflow = 'hidden';
      unsubscribe();
    };
  }, [id]);

  if (!isVisible) {
    return null;
  }

  if (loading) {
    return <div className="text-center py-10 text-lg">Caricamento in corso...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500 text-lg">{error}</div>;
  }

  const handleImageLoad = (index) => {
    setImageLoading((prevState) => ({ ...prevState, [index]: false }));
  };

  const handleImageError = (index) => {
    setImageLoading((prevState) => ({ ...prevState, [index]: false }));
  };

  return (
    <div className="p-4 max-w-screen-lg mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="bg-primary text-white text-lg font-bold py-2 px-4 rounded-lg mb-4 hover:bg-red-200 transition"
      >
        Chiudi Scheda
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          {product.images && product.images.length > 0 ? (
            product.images.map((image, index) => (
              <div
                key={index}
                className="relative w-full aspect-square bg-gray-200 rounded-md shadow-md overflow-hidden"
              >
                {/* Placeholder in load page */}
                {imageLoading[index] !== false && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                    <div className="animate-pulse h-full w-full bg-gray-300"></div>
                  </div>
                )}

                <img
                  src={getImageUrl(image)}
                  alt={product.name}
                  onLoad={() => handleImageLoad(index)} // image fetchede
                  onError={() => handleImageError(index)} // menage error load
                  draggable="false"
                  className={`w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
                    imageLoading[index] !== false ? 'opacity-0' : 'opacity-100'
                  }`}
                />
              </div>
            ))
          ) : (
            <p className="text-gray-600">Nessuna immagine disponibile.</p>
          )}
        </div>

        {/* Detail section */}
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.name}</h1>
          <p className="text-xl text-gray-600 mb-4">${product.price?.toFixed(2) || 'N/A'}</p>

          <div className="mt-8">
            <h3 className="font-semibold text-2xl mb-4">Dettagli Prodotto:</h3>
            <p className="text-gray-700 leading-relaxed mb-2">{product.description || 'Descrizione non disponibile.'}</p>
            <p className="text-gray-600 mb-1"><span className="font-semibold">Origine:</span> {product.origin || 'N/A'}</p>

            {/* Section Allergeni */}
            <div className="flex items-center mb-1">
              <span className="font-semibold">Allergeni:</span>
              <div className="flex ml-2">
                {product.allergens && product.allergens.length > 0 ? (
                  product.allergens.map((allergen, index) => (
                    <span key={index} className="flex items-center mr-2">
                      {allergenIcons[allergen]?.icon}
                      <span className="text-gray-600">{allergen}</span>
                    </span>
                  ))
                ) : (
                  <span className="text-gray-600">Nessun allergene segnalato.</span>
                )}
              </div>
            </div>

            <p className="text-gray-600 mb-1"><span className="font-semibold">Tempo di preparazione:</span> {product.preparationTime || 'N/A'}</p>

            {product.availableSizes && product.availableSizes.length > 0 ? (
              <div className="mb-4">
                <label className="block text-lg font-semibold mb-2">Porzioni disponibili:</label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="border border-gray-300 rounded-md p-2 text-gray-700 w-full"
                >
                  <option value="">Seleziona una porzione</option>
                  {product.availableSizes.map((size, index) => (
                    <option key={index} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            ) : (
              <p className="text-gray-600">Nessuna porzione disponibile.</p>
            )}

            <p className="text-gray-600"><span className="font-semibold">Suggerimento:</span> {product.servingSuggestion || 'N/A'}</p>
          </div>

          {product.chefRecommendation && (
            <div className="mt-8 bg-gray-100 p-4 rounded-lg">
              <h4 className="font-semibold text-lg">Consiglio dello Chef:</h4>
              <p className="text-gray-700">{product.chefRecommendation}</p>
            </div>
          )}

          <div className="mt-8">
            <h4 className="font-semibold text-lg">Informazioni Nutrizionali:</h4>
            <p className="text-gray-600">Calorie: {product.nutritionalInfo?.calories || 'N/A'} kcal</p>
            <p className="text-gray-600">Proteine: {product.nutritionalInfo?.protein || 'N/A'} g</p>
            <p className="text-gray-600">Grassi: {product.nutritionalInfo?.fat || 'N/A'} g</p>
            <p className="text-gray-600">Carboidrati: {product.nutritionalInfo?.carbohydrates || 'N/A'} g</p>
          </div>
        </div>
      </div>

      {/* Rewiews */}
      {product.reviews && product.reviews.length > 0 && (
        <div className="mt-8">
          <h4 className="font-semibold text-lg">Recensioni:</h4>
          <div className="space-y-4">
            {product.reviews.map((review, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow">
                <p className="text-gray-800"><strong>{review.user}:</strong> {review.comment}</p>
                <div className="flex items-center">
                  {[...Array(5)].map((star, i) => (
                    <FaStar
                      key={i}
                      className={`mr-1 ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Special Offert */}
      {product.specialOffers && (
        <div className="mt-8 bg-yellow-50 p-4 rounded-lg border border-yellow-400">
          <h4 className="font-semibold text-lg">Offerte Speciali:</h4>
          <p className="text-gray-800">{product.specialOffers}</p>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
