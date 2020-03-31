import React from 'react';
import '../assets/styles/components/Footer.scss';
import classNames from 'classnames';

const Footer = ({ isHome }) => {

  const footerStyle = classNames({
    'footer-isHome': isHome,
  });

  return (
    <footer className={`${footerStyle} footer`}>
      <a href="/">Términos de uso</a>
      <a href="/">Declaración de privacidad</a>
      <a href="/">Centro de ayuda</a>
    </footer>
  );
};

export default Footer;
