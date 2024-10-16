// CreateCategory.js
import React from 'react';
import { collection, addDoc } from 'firebase/firestore';  // Importa le funzioni modulate
import { db } from '../firebaseConfig';  // Importa Firestore configurato

const CreateCategory = () => {
  const items = [
    { icon: 'category_img/appetizers.jpg', label: 'Antipasti', path: '/category/antipasti' },
    { icon: 'category_img/drinks.png', label: 'Bevande', path: '/category/drinks' },
    { icon: 'category_img/lunch_set.avif', label: 'Lunch Set', path: '/category/lunch_set' },
    { icon: 'category_img/original_sushi.png', label: 'Sushi e Sashimi', path: '/category/sashimi' },
    { icon: 'category_img/moriawase.png', label: 'Sushi Roll', path: '/category/moriawase' }
  ];

  // Funzione per aggiungere i dati a Firestore
  const createCategoryCollection = async () => {
    try {
      for (const item of items) {
        await addDoc(collection(db, 'category'), item); // Usa il nuovo approccio modulare per Firebase 9
        console.log(`Added category: ${item.label}`);
      }
      alert('Collection created successfully!');
    } catch (error) {
      console.error('Error creating collection: ', error);
    }
  };

  return (
    <div>
      <h1>Create Category Collection</h1>
      <button onClick={createCategoryCollection}>Create Collection</button>
    </div>
  );
};

export default CreateCategory;
