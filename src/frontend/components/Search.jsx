import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { searchVideo } from '../actions';
import '../assets/styles/components/Search.scss';

const Search = (props) => {
  const { isHome } = props;
  const inputStyle = classNames('input', {
    isHome,
  });

  const handleChange = (event) => {
    props.searchVideo(event.target.value);
  };

  return (
    <section className="main">
      <h2 className="main__title">¿Qué quieres ver hoy?</h2>
      <input aria-label="Buscar" className={inputStyle} type="text" placeholder="Buscar..." onChange={handleChange} />
    </section>
  );
};

const mapDispatchToProps = {
  searchVideo,
};

export default connect(null, mapDispatchToProps)(Search);
