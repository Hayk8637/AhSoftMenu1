import React from 'react';
import './style.css';
import Header from '../../components/header/Header';
import Banner from '../../components/banner/Banner';
import AllMenu from '../../components/allMenu/AllMenu';

const HomeMenu: React.FC = () => {
 
  return (
    <div className="home">
      <Header />
      <Banner/>
      <AllMenu />
    </div>
  );
};

export default HomeMenu;
