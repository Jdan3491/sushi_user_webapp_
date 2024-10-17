import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig'; 
import SushiCard from './SushiCard';
import SushiCardSkeleton from './SushiCardSkeleton'; 
import WelcomeSection from './WelcomeSection';

const SushiList = ({ category, meal }) => {
  const [sushiItems, setSushiItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentText, setCurrentText] = useState(0);
  const [fade, setFade] = useState(true);
  const isLunchTime = true;

  const texts = [
    { text: "Preparati a sentire il tuo palato esplodere di gioia", isH1: true },
    { text: "Seleziona dalle categorie tutti i prodotti che vuoi e Buon appetito amico", isH1: false }
  ];

  const filteredSushiItems = category ? sushiItems.filter(item => {
    if (meal === 'lunch' && !item.isAvailableAtLunch) return false;
    if (meal === 'dinner' && !item.isAvailableAtDinner) return false;
    return item.category === category;
  }) : [];

  const backgroundImage = "url('https://firebasestorage.googleapis.com/v0/b/sushi-user-c386d.appspot.com/o/generic_img%2Fintro_page_bg.png?alt=media')";
  const chopsticksImage = "https://firebasestorage.googleapis.com/v0/b/sushi-user-c386d.appspot.com/o/generic_img%2Fintro_page_chopsticks.png?alt=media"; 

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (querySnapshot) => {
      const sushiList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSushiItems(sushiList);
      setLoading(false);
    }, (error) => {
      console.error("Errore durante il recupero dei dati: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentText((prevText) => (prevText + 1) % texts.length);
        setFade(true);
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main 
      className="bg-secondary p-4 h-screen w-full md:w-3/4 overflow-y-auto custom-scrollbar mb-20"
      style={!category ? { backgroundImage, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
    >
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <SushiCardSkeleton key={index} />
          ))}
        </div>
      ) : category ? (
        filteredSushiItems.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <p className="text-gray-600 text-lg">Nessun sushi trovato per questa categoria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-48 scroll-m-44">
            {filteredSushiItems.map((sushi) => (
              <SushiCard 
                key={`sushi-${sushi.id}-${sushi.name.replace(/\s+/g, '-').toLowerCase()}`} 
                sushi={sushi} 
                isLunchTime={isLunchTime} 
              />
            ))}
            <div className="block md:hidden h-1 bg-gray-300 my-8"></div>
          </div>
        )
      ) : (
        <WelcomeSection texts={texts} chopsticksImage={chopsticksImage} />
      )}
    </main>
  );
};

export default SushiList;
