import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import gravatar from '../utils/gravatar';
import { logoutRequest } from '../actions';
import '../assets/styles/components/Header.scss';
import logo from '../assets/static/logo-platzi-video-BW2.png';
import userIcon from '../assets/static/default-avatar.png';

const Header = (props) => {
  const { user, isLogin, isRegister } = props;
  const hasUser = Object.keys(user).length > 0;
  const headerStyle = classNames('header', {
    isLogin,
    isRegister,
  });
  const handleLogout = () => {
    props.logoutRequest({});
  };

  return (
    <header className={headerStyle}>
      <Link to="/">
        <img className="header__img" src={logo} alt="Platzi vídeo logo" />
      </Link>
      <div className="header__menu">
        <div className="header__menu--profile">
          {hasUser ?
            <img src={gravatar(user.email)} alt={user.email} /> :
            <img src={userIcon} alt="Avatar logo" />
          }
          <p>Perfil</p>
        </div>
        <ul>
          {hasUser ?
            <li><a href="/">{user.name}</a></li> :
            null
          }
          {hasUser ?
            <li><a href="#logout" onClick={handleLogout}>Cerrar Sesión</a></li> :
            <li><Link to="/login">Iniciar sesión</Link></li>
          }
        </ul>
      </div>
    </header>
  );
};

Header.propTypes = {
  user: PropTypes.object,
  logoutRequest: PropTypes.func,
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = {
  logoutRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
