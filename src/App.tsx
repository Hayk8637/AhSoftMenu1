import React from 'react';
import './App.css';
import { Route, Routes , BrowserRouter as Router } from 'react-router-dom';
import Home from './pages/home/Home';
import Menu from './pages/menu/Menu';
import Cart from './pages/cart/Cart';
import MenuItemDescription from './pages/menuItemDescription/MenuItemDescription';
import Error404 from './pages/error404/Error404';
import { CartProvider } from './context/CartContext';

function App() {
  return <Router>
    <CartProvider>
      <Routes>
        <Route path='/' element={<Error404 />}/>
        <Route path='/MENUBYQR' element={<Home/>} />
        <Route path='/MENUBYQR/menu' element={<Home/>}/>
        <Route path='/MENUBYQR/menu/*' element={<Menu/>}/>
        <Route path='/MENUBYQR/menu/*/*' element={<MenuItemDescription/>}/>
        <Route path='/MENUBYQR/cart' element= {<Cart/>}/>
        <Route path='*' element={<Error404/>}/>
      </Routes>
      </CartProvider>
  </Router>;
}

export default App;
