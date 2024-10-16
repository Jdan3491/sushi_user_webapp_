// src/CreateSession.js
import React, { useState } from 'react';
import { db } from '../firebaseConfig'; // Importa Firestore
import { collection, addDoc, Timestamp } from 'firebase/firestore'; // Importa le funzioni necessarie

const CreateSession = () => {
    const [customerCount, setCustomerCount] = useState(1); // Contatore dei clienti

    const addSession = async () => {
        try {
            const docRef = await addDoc(collection(db, "sessions"), {
                session_start_time: Timestamp.fromDate(new Date()),
                session_end_time: null,
                table_id: '23',
                is_active: true,
                customer_count: customerCount,
            });
            console.log("Sessione aggiunta con ID: ", docRef.id);
            // Reset del contatore dei clienti dopo la creazione della sessione
            setCustomerCount(1);
        } catch (error) {
            console.error("Errore aggiungendo la sessione: ", error);
        }
    };

    return (
        <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "5px", maxWidth: "400px" }}>
            <h2>Crea una nuova sessione</h2>
            <label>
                Numero di clienti:
                <input 
                    type="number" 
                    value={customerCount} 
                    onChange={(e) => setCustomerCount(parseInt(e.target.value) || 1)} 
                    min="1"
                    style={{ marginLeft: "10px" }}
                />
            </label>
            <button onClick={addSession} style={{ marginTop: "20px" }}>
                Crea Sessione
            </button>
        </div>
    );
};

export default CreateSession;
