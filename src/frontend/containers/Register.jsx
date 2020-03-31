import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { registerUser } from '../actions';
import '../assets/styles/components/Register.scss';

const Register = (props) => {

  const [form, setValues] = useState({
    email: '',
    name: '',
    password: '',
  });

  const handleInput = (event) => {
    setValues({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    props.registerUser(form, '/login');
  };

  return (
    <section className="register">
      <section className="register__container">
        <h2>Regístrate</h2>
        <form className="register__container--form" action="" onSubmit={handleSubmit}>
          <input
            name="name"
            aria-label="Nombre"
            className="login__input"
            type="text"
            placeholder="Nombre"
            onChange={handleInput}
            required
          />
          <input
            name="email"
            aria-label="Correo"
            className="login__input"
            type="text"
            placeholder="Correo"
            onChange={handleInput}
            required
          />
          <input
            name="password"
            aria-label="Contraseña"
            className="login__input"
            type="password"
            placeholder="Contraseña"
            onChange={handleInput}
            required
          />
          <button type="submit" className="button">Regístrarme</button>
        </form>
        <p className="register__container--register"><Link to="/login">Iniciar sesión</Link></p>
      </section>
    </section>
  );
};

const mapDispatchToProps = {
  registerUser,
};

export default connect(null, mapDispatchToProps)(Register);
