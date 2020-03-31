import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  const location = useLocation();
  return (
    <div className="App">
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
