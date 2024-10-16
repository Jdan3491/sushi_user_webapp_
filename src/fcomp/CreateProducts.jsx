// src/CreateProducts.js
import React, { useState } from 'react';
import { db } from '../firebaseConfig'; // Assicurati di importare il tuo firebase config
import { collection, addDoc } from 'firebase/firestore';


const sushiItems = [
  {
    name: 'Sashimi di Salmone',
    price: 12,
    images: ['product_img/moriawase.png'],
    category: 'moriawase',
    isPaid: true,
    isAvailableAtLunch: true,
    isAvailableAtDinner: true,
    isAvailable: true,
    isAllYouCanEat: false,
    description: 'Fette di salmone freschissimo, tagliate sottili.',
    allergens: ['Pesce'],
    origin: 'Giappone',
    preparationTime: '5 min',
    servingSuggestion: 'Servire con salsa di soia e wasabi.',
    chefRecommendation: 'Accompagnare con un bicchiere di sake freddo.',
  },
  {
    name: 'Sashimi di Tonno',
    price: 14,
    images: ['product_img/moriawase.png'],
    category: 'moriawase',
    isPaid: true,
    isAvailableAtLunch: true,
    isAvailableAtDinner: true,
    isAvailable: true,
    isAllYouCanEat: false,
    description: 'Fette di tonno fresco, tagliate sottili.',
    allergens: ['Pesce'],
    origin: 'Giappone',
    preparationTime: '5 min',
    servingSuggestion: 'Servire con salsa di soia e un po\' di zenzero.',
    chefRecommendation: 'Perfetto con un bicchiere di tè verde freddo.',
  },
  {
    name: 'California Roll',
    price: 8,
    images: ['product_img/moriawase.png'],
    category: 'moriawase',
    isPaid: true,
    isAvailableAtLunch: true,
    isAvailableAtDinner: true,
    isAvailable: true,
    isAllYouCanEat: true,
    description: 'Roll con surimi, avocado, cetriolo e semi di sesamo.',
    allergens: ['Crostacei', 'Glutine', 'Sesamo'],
    origin: 'Stati Uniti',
    preparationTime: '8 min',
    servingSuggestion: 'Servire con salsa di soia e zenzero marinato.',
    chefRecommendation: 'Ottimo con un bicchiere di vino bianco secco.',
  },
  {
    name: 'Spicy Tuna Roll',
    price: 9,
    images: ['product_img/moriawase.png'],
    category: 'moriawase',
    isPaid: true,
    isAvailableAtLunch: true,
    isAvailableAtDinner: true,
    isAvailable: true,
    isAllYouCanEat: true,
    description: 'Roll piccante con tonno fresco e salsa piccante.',
    allergens: ['Pesce', 'Glutine'],
    origin: 'Giappone',
    preparationTime: '7 min',
    servingSuggestion: 'Servire con un tocco di maionese piccante.',
    chefRecommendation: 'Perfetto con birra giapponese.',
  },
  {
    name: 'Ebi Tempura Roll',
    price: 10,
    images: ['product_img/moriawase.png'],
    category: 'moriawase',
    isPaid: true,
    isAvailableAtLunch: true,
    isAvailableAtDinner: true,
    isAvailable: true,
    isAllYouCanEat: true,
    description: 'Roll con gamberi in tempura e avocado.',
    allergens: ['Crostacei', 'Glutine'],
    origin: 'Giappone',
    preparationTime: '8 min',
    servingSuggestion: 'Servire con salsa tentsuyu.',
    chefRecommendation: 'Ideale con tè freddo al gelsomino.',
  },
  {
    name: 'Rainbow Roll',
    price: 11,
    images: ['product_img/moriawase.png'],
    category: 'moriawase',
    isPaid: true,
    isAvailableAtLunch: true,
    isAvailableAtDinner: true,
    isAvailable: true,
    isAllYouCanEat: false,
    description: 'Roll con avocado, cetriolo, surimi, e un mix di pesce fresco sopra.',
    allergens: ['Pesce', 'Crostacei'],
    origin: 'Giappone',
    preparationTime: '9 min',
    servingSuggestion: 'Servire con salsa di soia e wasabi.',
    chefRecommendation: 'Perfetto con un bicchiere di sake freddo.',
  },
  {
    name: 'Sashimi Misto',
    price: 18,
    images: ['product_img/moriawase.png'],
    category: 'moriawase',
    isPaid: true,
    isAvailableAtLunch: true,
    isAvailableAtDinner: true,
    isAvailable: true,
    isAllYouCanEat: false,
    description: 'Selezione di sashimi di salmone, tonno e gamberi.',
    allergens: ['Pesce', 'Crostacei'],
    origin: 'Giappone',
    preparationTime: '10 min',
    servingSuggestion: 'Servire con salsa di soia e wasabi.',
    chefRecommendation: 'Ideale per una cena elegante con sake premium.',
  },
  {
    name: 'Dragon Roll',
    price: 12,
    images: ['product_img/moriawase.png'],
    category: 'moriawase',
    isPaid: true,
    isAvailableAtLunch: true,
    isAvailableAtDinner: true,
    isAvailable: true,
    isAllYouCanEat: false,
    description: 'Roll con tempura di gamberi, avocado e tobiko.',
    allergens: ['Crostacei', 'Glutine', 'Pesce'],
    origin: 'Giappone',
    preparationTime: '9 min',
    servingSuggestion: 'Servire con salsa di soia e zenzero.',
    chefRecommendation: 'Ottimo con un bicchiere di vino bianco fresco.',
  },
  {
    name: 'Philadelphia Roll',
    price: 9,
    images: ['product_img/moriawase.png'],
    category: 'moriawase',
    isPaid: true,
    isAvailableAtLunch: true,
    isAvailableAtDinner: true,
    isAvailable: true,
    isAllYouCanEat: true,
    description: 'Roll con salmone, formaggio cremoso e avocado.',
    allergens: ['Pesce', 'Latticini'],
    origin: 'Stati Uniti',
    preparationTime: '8 min',
    servingSuggestion: 'Servire con salsa di soia dolce.',
    chefRecommendation: 'Accompagnare con tè verde freddo.',
  },
  {
    name: 'Hosomaki al Salmone',
    price: 7,
    images: ['product_img/moriawase.png'],
    category: 'moriawase',
    isPaid: true,
    isAvailableAtLunch: true,
    isAvailableAtDinner: true,
    isAvailable: true,
    isAllYouCanEat: true,
    description: 'Roll sottile con salmone e alga nori all’esterno.',
    allergens: ['Pesce'],
    origin: 'Giappone',
    preparationTime: '5 min',
    servingSuggestion: 'Servire con salsa di soia e wasabi.',
    chefRecommendation: 'Perfetto con un bicchiere di birra giapponese.',
  }
];



const CreateProducts = () => {
  const [loading, setLoading] = useState(false); // Stato per gestire il caricamento

  const addProducts = async () => {
    setLoading(true);
    try {
      for (const item of sushiItems) {
        await addDoc(collection(db, 'products'), item);
        console.log(`${item.name} aggiunto con successo!`);
      }
      alert('Tutti i prodotti sono stati aggiunti con successo!');
    } catch (error) {
      console.error("Errore nell'aggiungere i prodotti: ", error);
      alert('Errore nell\'aggiunta dei prodotti. Controlla la console per dettagli.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={addProducts} disabled={loading} style={{ padding: '10px 20px', background: 'red', fontSize: '16px', cursor: loading ? 'not-allowed' : 'pointer' }}>
        {loading ? 'Caricamento...' : 'Carica Prodotti'}
      </button>
    </div>
  );
};

export default CreateProducts;
