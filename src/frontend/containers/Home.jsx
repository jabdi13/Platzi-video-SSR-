import React from 'react';
import { connect } from 'react-redux';
import Search from '../components/Search';
import Categories from '../components/Categories';
import Carousel from '../components/Carousel';
import CarouselItem from '../components/CarouselItem';
import '../assets/styles/App.scss';
import Header from "../components/Header";

const Home = ({ myList, trends, originals, searchText }) => {
  return (
    <>
      <Header />
      <Search isHome />
      {myList.length < 1 && trends.length < 1 && originals.length < 1 && searchText !== '' && (
        <h1 className="main__notFoundTitle">No se encontrarón resultados</h1>
      )}
      {myList.length > 0 && (
        <Categories title="Mi lista">
          <Carousel>
            {myList.map((item) => (
              <CarouselItem
                key={item.id}
                {...item}
                isList
              />
            ))}
          </Carousel>
        </Categories>
      )}

      {trends.length > 0 && (
        <Categories title="Tendencias">
          <Carousel>
            {trends.map((item) => <CarouselItem key={item.id} {...item} />)}
          </Carousel>
        </Categories>
      )}

      {originals.length > 0 && (
        <Categories title="Originales de Platzi Vídeo">
          <Carousel>
            {originals.map((item) => <CarouselItem key={item.id} {...item} />)}
          </Carousel>
        </Categories>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  if (state.searchText !== '') {
    return {
      myList: state.myList.filter((item) => item.title.toLowerCase().indexOf(state.searchText) !== -1),
      trends: state.trends.filter((item) => item.title.toLowerCase().indexOf(state.searchText) !== -1),
      originals: state.originals.filter((item) => item.title.toLowerCase().indexOf(state.searchText) !== -1),
      searchText: state.searchText
    };
  }
  return {
    myList: state.myList,
    trends: state.trends,
    originals: state.originals,
    searchText: state.searchText
  };
};

export default connect(mapStateToProps, null)(Home);
