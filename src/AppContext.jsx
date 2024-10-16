import React, { createContext, useContext, useState } from 'react';

// Crea il contesto
const AppContext = createContext();

// Provider del contesto
export const AppProvider = ({ children }) => {
  const [selectedProducts, setSelectedProducts] = useState({}); // Stato per i prodotti selezionati

  const addProduct = (sushi) => {
    setSelectedProducts((prev) => {
      const currentQty = prev[sushi.id]?.quantity || 0;
      const newQty = currentQty + 1; // Calcola la nuova quantità
      console.log(`Aggiungendo ${sushi.name}. Nuova quantità: ${newQty}`);
      console.log(selectedProducts);
      return {
        ...prev,
        [sushi.id]: { ...sushi, quantity: newQty }, // Aggiungi il prodotto con la nuova quantità
      };
    });
  };

  const removeProduct = (sushiId) => {
    setSelectedProducts((prev) => {
      const newProducts = { ...prev };
      const productName = prev[sushiId]?.name || 'Prodotto sconosciuto';
      delete newProducts[sushiId]; // Rimuovi il prodotto
      console.log(`Rimuovendo ${productName}`);
      return newProducts;
    });
  };

  const updateQuantity = (sushiId, quantity) => {
    setSelectedProducts((prev) => {
      const productName = prev[sushiId]?.name || 'Prodotto sconosciuto';
      if (quantity <= 0) {
        const newProducts = { ...prev };
        delete newProducts[sushiId]; // Rimuovi il prodotto se la quantità è zero
        console.log(`Rimuovendo ${productName} poiché la quantità è zero`);
        return newProducts;
      }
      console.log(`Aggiornando ${productName} a nuova quantità: ${quantity}`);
      return {
        ...prev,
        [sushiId]: { ...prev[sushiId], quantity }, // Aggiorna la quantità
      };
    });
  };

  return (
    <AppContext.Provider value={{ selectedProducts, addProduct, removeProduct, updateQuantity }}>
      {children}
    </AppContext.Provider>
  );
};

// Hook per utilizzare il contesto
export const useAppContext = () => useContext(AppContext);
export { AppContext }; // Assicurati che AppContext sia esportato
