interface ICartItem {
    id: number,
    category: string,
    itemId: number
}

export const saveCartToStorage = (cartItems: ICartItem[]) => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  };
  
  export const loadCartFromStorage = (): ICartItem[] => {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  };