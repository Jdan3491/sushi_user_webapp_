import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import CustomAvatar from './CustomAvatar';

const LeftSidebar = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryCollection = collection(db, 'category');
        const categorySnapshot = await getDocs(categoryCollection);
        const categoryData = categorySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCategories(categoryData);
      } catch (error) {
        console.error('Errore nel recupero delle categorie:', error);
      }
    };

    fetchCategories();
  }, []);

  const storageBaseUrl = import.meta.env.VITE_SUSHI_FIREBASE_STORAGE_URL;
  const altParam = import.meta.env.VITE_SUSHI_ALT_PARAM;

  return (
    <>
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex md:w-2/12 bg-gray-200 p-4 h-screen overflow-y-auto shadow-lg">
        <div className="w-full flex flex-col space-y-4">
          {categories.map((category, index) => {
            const iconPath = category.icon || 'default_image.png';
            const imgSrc = `${storageBaseUrl}${encodeURIComponent(iconPath)}${altParam}`;

            return (
              <Link 
                key={index} 
                to={category.path} 
                className="flex flex-col items-center bg-white p-4 shadow-md rounded-lg transition-transform duration-200 transform hover:scale-105 hover:bg-gray-100"
              >
                <CustomAvatar 
                  src={imgSrc} 
                  label={category.label} 
                />
              </Link>
            );
          })}
        </div>
      </aside>

      {/* Sidebar Mobile */}
      <aside className="md:hidden flex overflow-x-auto bg-gray-200 p-2 h-28 shadow-md">
        <div className="flex space-x-4">
          {categories.map((category, index) => {
            const iconPath = category.icon || 'default_image.png';
            const imgSrc = `${storageBaseUrl}${encodeURIComponent(iconPath)}${altParam}`;

            return (
              <Link 
                key={index} 
                to={category.path} 
                className="flex flex-col items-center bg-white p-4 shadow-md rounded-lg transition-transform duration-200 transform hover:scale-105 hover:bg-gray-100 min-w-max"
              >
                <CustomAvatar 
                  src={imgSrc} 
                  label={category.label} 
                />
              </Link>
            );
          })}
        </div>
      </aside>
    </>
  );
};

export default LeftSidebar;
