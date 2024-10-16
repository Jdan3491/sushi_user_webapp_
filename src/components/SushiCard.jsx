import React, { useContext, useState, useMemo } from 'react';
import { FaPlus, FaInfoCircle, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { AppContext } from '../AppContext';

const storageBaseUrl = import.meta.env.VITE_SUSHI_FIREBASE_STORAGE_URL;
const altParam = import.meta.env.VITE_SUSHI_ALT_PARAM;

const getImageUrl = (imagePath) => {
  const encodedImagePath = imagePath || 'default_image.png';
  return `${storageBaseUrl}${encodeURIComponent(encodedImagePath)}${altParam}&w=1000`;
};

const SushiCard = ({ sushi, isLunchTime }) => {
  const { addProduct, updateQuantity, selectedProducts } = useContext(AppContext);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  const count = useMemo(() => {
    const itemInCart = selectedProducts[sushi.id];
    return itemInCart ? itemInCart.quantity : 0;
  }, [selectedProducts, sushi.id]);

  const increaseCount = () => {
    addProduct(sushi);
  };

  const decreaseCount = () => {
    if (count > 1) {
      updateQuantity(sushi.id, count - 1);
    } else {
      updateQuantity(sushi.id, 0);
    }
  };

  const isAvailableNow = () => {
    if (!sushi.isAvailable) return false;
    if (isLunchTime && sushi.isAvailableAtLunch) return true;
    if (!isLunchTime && sushi.isAvailableAtDinner) return true;
    return false;
  };

  const availableNow = isAvailableNow();

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % sushi.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      (prevIndex - 1 + sushi.images.length) % sushi.images.length
    );
  };

  return (
    <div className={`shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 w-full h-auto 
        ${availableNow ? 'bg-white' : 'bg-gray-300 cursor-not-allowed'} 
        ${count > 0 ? 'ring-8 ring-primary' : ''}`}>
      <div className="relative w-full h-40">
        {sushi.images?.length > 1 ? (
          <>
            <img
              src={getImageUrl(sushi.images[currentImageIndex])}
              alt={sushi.name}
              className={`absolute inset-0 w-full h-full object-cover ${!imageLoaded ? 'hidden' : 'block'}`}
              onLoad={() => setImageLoaded(true)}
              style={{ objectFit: 'center' }}
            />
            {!imageLoaded && <div className="absolute inset-0 flex justify-center items-center">Loading...</div>}
            <button
              onClick={prevImage}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-md p-2 transition-transform hover:scale-110"
            >
              <FaChevronLeft className="text-gray-700" />
            </button>
            <button
              onClick={nextImage}
              aria-label="Next image"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-md p-2 transition-transform hover:scale-110"
            >
              <FaChevronRight className="text-gray-700" />
            </button>
          </>
        ) : (
          <img
            src={getImageUrl(sushi.images?.[0])}
            alt={sushi.name}
            className={`absolute inset-0 w-full h-full object-cover ${!imageLoaded ? 'hidden' : 'block'}`}
            onLoad={() => setImageLoaded(true)}
            style={{ objectFit: 'cover' }}
          />
        )}
        {!imageLoaded && <div className="absolute inset-0 flex justify-center items-center">Loading...</div>}
        <Link to={`/product/${sushi.id}`} className="absolute top-2 right-2 bg-primary text-white rounded-full p-2 hover:bg-red-600 transition duration-150">
          <FaInfoCircle />
        </Link>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{sushi.name}</h3>
        <p className="text-gray-700 text-md">${sushi.price.toFixed(2)}</p>

        {/* Mostra il rating se esiste */}
        {sushi.rating && (
          <div className="flex items-center mt-1">
            {Array.from({ length: 5 }, (_, index) => (
              <span key={index} className={`material-icons ${index < sushi.rating ? 'text-yellow-500' : 'text-gray-300'}`}>
                ★
              </span>
            ))}
          </div>
        )}

        {availableNow ? (
          <>
            <div className="flex items-center mt-2">
              <button
                onClick={decreaseCount}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-l-md transition duration-150"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="bg-gray-200 py-2 px-4 text-sm font-semibold">{count}</span>
              <button
                onClick={increaseCount}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-r-md transition duration-150"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </>
        ) : (
          <p className="mt-2 text-red-500 font-semibold">
            {sushi.isAvailable ? 'Non disponibile ora' : 'Non disponibile'}
          </p>
        )}
      </div>
    </div>
  );
};

export default SushiCard;
