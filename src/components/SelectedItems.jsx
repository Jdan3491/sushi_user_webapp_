import React, { useContext, useState, useEffect } from 'react';
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import { PiTelegramLogoFill } from "react-icons/pi";
import { AppContext } from '../AppContext';
import { getAuth } from "firebase/auth";
import { getFirestore, collection, onSnapshot, doc, setDoc, query, where } from "firebase/firestore";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const SelectedItems = () => {
  const { selectedProducts, addProduct, updateQuantity, removeProduct } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [email, setEmail] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [products, setProducts] = useState({});
  const [previousOrdersTotal, setPreviousOrdersTotal] = useState(0);
  const [tableId, setTableId] = useState(localStorage.getItem('tableID') || '');
  const [customerCount, setCustomerCount] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [orderId, setOrderId] = useState(localStorage.getItem('orderId') || '');
  const [isLoadingOrder, setIsLoadingOrder] = useState(false); // Nuovo stato per il caricamento

  const navigate = useNavigate();

  const storageBaseUrl = import.meta.env.VITE_SUSHI_FIREBASE_STORAGE_URL;
  const altParam = import.meta.env.VITE_SUSHI_ALT_PARAM;

  const db = getFirestore();

  // Fetch categories from Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesCollection = collection(db, "category");
      const unsubscribe = onSnapshot(categoriesCollection, (snapshot) => {
        const categoriesList = snapshot.docs.map(doc => ({
          id: doc.id,
          path: doc.data().path,
        }));
        setCategories(categoriesList);
      });

      return () => unsubscribe();
    };

    fetchCategories();
  }, [db]);

  // Fetch session data from Firestore
  useEffect(() => {
    const fetchSessionData = async () => {
      const storedTableId = localStorage.getItem('tableID');
      const storedOrderId = localStorage.getItem('orderId');

      if (!storedTableId || !storedOrderId) {
        navigate('/404');
        return;
      }

      const sessionQuery = query(collection(db, "sessions"), where("table_id", "==", storedTableId), where("is_active", "==", true));
      const unsubscribe = onSnapshot(sessionQuery, (snapshot) => {
        if (snapshot.empty) {
          navigate('/404');
          return;
        }

        let sessionFound = false;
        snapshot.forEach(doc => {
          const data = doc.data();
          if (data.order_id === storedOrderId) {
            sessionFound = true;
            setOrderId(data.order_id);
            setOrderNumber(data.order_id);
            setCustomerCount(data.customer_count);
            setIsActive(data.is_active);
          }
        });

        if (!sessionFound) {
          navigate('/404');
        }
      });

      return () => unsubscribe();
    };

    fetchSessionData();
  }, [db, navigate]);

  // Filter items based on search term and selected category
  const filteredItems = Object.values(selectedProducts).filter(item => {
    const categoryName = item.category.split('/').pop(); // Extract the final part of the category
    return (
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
      (!selectedCategory || categoryName === selectedCategory)
    );
  });

  // Set email and fetch previous orders total
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      setEmail(user.email);
      fetchPreviousOrdersTotal();
    } else {
      setEmail('');
    }
  }, []);

  // Fetch previous orders' total
  const fetchPreviousOrdersTotal = async () => {
    try {
      const ordersRef = collection(db, "orders");
      const q = query(ordersRef, where("tableNumber", "==", tableId));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const total = snapshot.docs.reduce((acc, doc) => acc + (doc.data().totalPrice || 0), 0);
        setPreviousOrdersTotal(total);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Error fetching previous orders:", error);
    }
  };


    // Update table
    useEffect(() => {
      if (tableId) {
        document.title = `Benvenuto cliente al tavolo ${tableId}`; // Set Title
      } else {
        document.title = "Benvenuto cliente"; // Default Title
      }
    }, [tableId]); // Execute Change Title from Backend


  // Fetch products from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const productsWithImages = {};

      snapshot.forEach((doc) => {
        productsWithImages[doc.id] = { id: doc.id, ...doc.data() };
      });

      setProducts(productsWithImages);
    });

    return () => unsubscribe();
  }, [db]);

  const increaseCount = (itemId) => {
    const item = selectedProducts[itemId];
    addProduct(item);
  };

  const decreaseCount = (itemId) => {
    const item = selectedProducts[itemId];
    if (item.quantity > 1) {
      updateQuantity(itemId, item.quantity - 1);
    } else {
      removeProduct(itemId);
    }
  };

  // Calculate the total for all selected products, not just the filtered ones
  const totalPrice = Object.values(selectedProducts).reduce((total, item) => {
    return total + (products[item.id]?.price || 0) * item.quantity;
  }, 0);

  // Calculate the final total (including previous orders)
  const cumulativeTotal = totalPrice + previousOrdersTotal;

  const callWaiter = async () => {
    if (filteredItems.length === 0) {
      toast.error('Nessun prodotto selezionato per inviare l\'ordine.');
      return;
    }

    setIsLoadingOrder(true); // Set loading state to true when processing starts

    const orderDetails = filteredItems.map(item => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: products[item.id]?.price || 0,
      total: (products[item.id]?.price || 0) * item.quantity,
    }));

    try {
      const orderRef = doc(collection(db, "orders")); // Create a reference for a new order
      await setDoc(orderRef, {
        orderNumber,
        tableNumber: tableId,
        email,
        items: orderDetails,
        totalPrice,
        createdAt: new Date(),
      });

      toast.success('Ordine inviato con successo!');

      // Reset selected products after submission
      Object.keys(selectedProducts).forEach(id => removeProduct(id));
    } catch (error) {
      console.error('Errore nel salvataggio dell\'ordine:', error);
      toast.error('Errore nel salvataggio dell\'ordine.');
    } finally {
      setIsLoadingOrder(false); // Set loading state to false when the operation is done
    }
  };

  const getImageUrl = (imagePath) => {
    const encodedImagePath = imagePath || 'default_image.png';
    return `${storageBaseUrl}${encodeURIComponent(encodedImagePath)}${altParam}`;
  };

  // Separate promotional item and sort items
  const promotionalItems = filteredItems.filter(item => item.isPromo); // Assume `isPromo` is the flag for promotional items
  const regularItems = filteredItems.filter(item => !item.isPromo);
  const sortedItems = [...regularItems, ...promotionalItems]; // Regular items first, promo last

  return (
    <aside className={`hidden md:flex md:w-1/2 p-4 flex-col bg-gray-100 h-screen overflow-y-auto custom-scrollbar`}>
      <div className="flex items-center justify-between mb-4 bg-blue-50 p-4 rounded-lg shadow-md">
        <div>
          <h1 className="text-lg font-bold text-gray-800">Tavolo #{tableId || 'Caricamento...'}</h1>
          <h2 className="text-lg font-bold text-gray-800">Numero Persone: {customerCount || 'Caricamento...'}</h2>
        </div>
        <div className="flex space-x-2 mb-4">
          <button
            onClick={callWaiter}
            className="h-16 w-16 bg-primary rounded-full flex items-center justify-center hover:bg-red-600 text-white shadow-md transition duration-200"
          >
            <PiTelegramLogoFill size={24} />
          </button>
        </div>
      </div>
    
      <div className="mb-4">
        <input
          type="text"
          placeholder="Cerca prodotto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-lg py-2 px-4 w-full"
        />
      </div>
    
      <div className="mb-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border rounded-lg py-2 px-4 w-full"
        >
          <option value="">Tutte le categorie</option>
          {categories.map((category) => (
            <option key={category.id} value={category.path}>
              {category.path.split('/').pop()} {/* Show only the last part of the path */}
            </option>
          ))}
        </select>
      </div>
    
      <ul className="divide-y divide-gray-300">
        {sortedItems.length > 0 ? (
          sortedItems.map((item) => (
            <li key={item.id} className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <img
                  src={getImageUrl(item.images[0])}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg shadow-md mr-2"
                  loading="lazy"
                />
                <div className="flex flex-col">
                  <span className="font-bold mr-2 text-gray-800">{item.name}</span>
                  <span className="text-gray-600 text-sm">{item.category.split('/').pop()}</span>
                  {/* Add rating */}
                  {item.rating && (
                    <div className="flex text-yellow-500">
                      {Array.from({ length: 5 }, (_, index) => (
                        <span key={index} className={`material-icons ${index < item.rating ? 'text-yellow-500' : 'text-gray-300'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center">
                  {item.quantity > 1 ? (
                    <button
                      onClick={() => decreaseCount(item.id)}
                      className="bg-red-600 text-white rounded-lg p-1 mx-1 hover:bg-red-700 transition duration-200 shadow-md"
                    >
                      <FaMinus />
                    </button>
                  ) : (
                    <button
                      onClick={() => decreaseCount(item.id)}
                      className="bg-red-600 text-white rounded-lg p-1 mx-1 hover:bg-red-700 transition duration-200 shadow-md"
                    >
                      <FaTrash />
                    </button>
                  )}
                  <span className="text-gray-700">{item.quantity}</span>
                  <button
                    onClick={() => increaseCount(item.id)}
                    className="bg-green-600 text-white rounded-lg p-1 mx-1 hover:bg-green-700 transition duration-200 shadow-md"
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
              <span className="font-bold text-gray-800">{(products[item.id]?.price || 0) * item.quantity} €</span>
            </li>
          ))
        ) : (
          <li className="text-center text-gray-600">Nessun prodotto selezionato.</li>
        )}
      </ul>
    
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
    
      <div className="bg-gray-200 p-4 rounded-lg shadow-md mt-4">
        <h3 className="font-bold text-lg text-gray-800">
          Totale di questo ordine: <span className="text-xl font-semibold">{isLoadingOrder ? 'Caricamento...' : (totalPrice || 0)} €</span>
        </h3>
        <h3 className="font-bold text-lg text-gray-800 mt-2">
          Totale finale: <span className="text-xl font-semibold">{isLoadingOrder ? 'Caricamento...' : (cumulativeTotal || 'Caricamento...')} €</span>
        </h3>
      </div>
    </aside>
  );
  
};

export default SelectedItems;
