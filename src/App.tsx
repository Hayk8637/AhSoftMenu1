import './App.css';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import HomeMenu from './pages/HomeMenu/HomeMenu';
import Menu from './pages/menu/Menu';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/:userId/:establishmentId' element={<HomeMenu />} />
        <Route path='/:userId/:establishmentId/:categoryId' element={<Menu />} />
        <Route path='*' element={<ConditionalRedirect />} />
      </Routes>
    </Router>
  );
}

const ConditionalRedirect = () => {
  window.location.href = 'https://www.menubyqr.com/';
  return null;
};

export default App;
