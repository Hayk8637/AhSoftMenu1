import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios'; // Import axios for fetching item details

interface CartItem {
  id: number;
  category: string;
  count: number;
  price: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  incrementItemCount: (itemId: number) => void;
  decrementItemCount: (itemId: number) => void;
  removeFromCart: (itemId: number) => void;
  getTotalPrice: () => number; // Add total price function here
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = async (item: CartItem) => {
    const { id, category } = item;

    // Fetch price from the server if not already included
    let price = item.price;
    if (price === undefined) {
      try {
        const url = `https://menubyqr-default-rtdb.firebaseio.com/MENUBYQR/${category}/${id}.json`;
        const response = await axios.get(url);
        price = response.data.price;
      } catch (error) {
        console.error('Failed to fetch item price:', error);
        return; // Exit if there's an error fetching the price
      }
    }

    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (cartItem) => cartItem.id === id && cartItem.category === category
      );

      if (existingItemIndex >= 0) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].count += 1;
        return updatedCart;
      } else {
        return [...prevCart, { ...item, count: 1, price }];
      }
    });
  };

  const incrementItemCount = (itemId: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId ? { ...item, count: item.count + 1 } : item
      )
    );
  };

  const decrementItemCount = (itemId: number) => {
    setCart((prevCart) =>
      prevCart.reduce<CartItem[]>((acc, item) => {
        if (item.id === itemId) {
          if (item.count > 1) {
            acc.push({ ...item, count: item.count - 1 });
          }
        } else {
          acc.push(item);
        }
        return acc;
      }, [])
    );
  };

  const removeFromCart = (itemId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.count, 0);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, incrementItemCount, decrementItemCount, removeFromCart, getTotalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
