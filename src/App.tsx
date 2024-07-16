import React from 'react';
import './App.css';
import { Route, Routes , BrowserRouter as Router } from 'react-router-dom';
import Home from './pages/home/Home';
import Menu from './pages/menu/Menu';
import Cart from './pages/cart/Cart';
import MenuItemDescription from './pages/menuItemDescription/MenuItemDescription';
import Error404 from './pages/error404/Error404';

function App() {
  return <Router>
      <Routes>
        <Route path='/' element={<Error404 />}/>
        <Route path='/r' element={<Home/>} />
        <Route path='/menu' element={<Menu/>}/>
        <Route path='/menu/description' element={<MenuItemDescription/>}/>
        <Route path='/cart' element= {<Cart/>}/>
        <Route path='*' element={<Error404/>}/>
      </Routes>
  </Router>;
}

export default App;
