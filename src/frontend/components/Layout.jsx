import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  const location = useLocation();
  return (
    <div className="App">
      <Header isHome={location.pathname === '/'} />
      {children}
      <Footer isHome={location.pathname === '/'} />
    </div>
  );
};

export default Layout;
