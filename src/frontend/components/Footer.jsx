import React from 'react';
import '../assets/styles/components/Footer.scss';
import classNames from 'classnames';

const Footer = ({ isHome }) => {

  return (
    <footer className="footer">
      <a href="/">Términos de uso</a>
      <a href="/">Declaración de privacidad</a>
      <a href="/">Centro de ayuda</a>
    </footer>
  );
};

export default Footer;
