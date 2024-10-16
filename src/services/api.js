// src/services/api.js

// Funzione per ottenere il menu dal server JSON
export const fetchMenu = async () => {
  const response = await fetch('http://localhost:5000/menu'); // Cambia l'URL
  const data = await response.json();
  return data; // Restituisce gli articoli del menu
};

// Funzione per inviare l'ordine al server
export const submitOrder = async (orderData) => {
  const response = await fetch('http://localhost:5000/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });

  return response.json(); // Restituisce la risposta JSON dal server
};
