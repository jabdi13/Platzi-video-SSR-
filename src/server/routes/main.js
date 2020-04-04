import { createStore } from "redux";
import reducer from "../../frontend/reducers";
import { renderToString } from "react-dom/server";
import { Provider } from "react-redux";
import { StaticRouter } from "react-router-dom";
import Layout from "../../frontend/components/Layout";
import { renderRoutes } from "react-router-config";
import { config } from '../config';
import serverRoutes from "../../frontend/routes/serverRoutes";
import axios from 'axios';
import React from "react";
import render from '../render';

const main = async (req, res, next) => {
    try {
        let initialState;
        try {
            const { token, email, name, id } = req.cookies;
            let user = {};

            if (email || email || id) {
                user = {
                    id,
                    email,
                    name
                };
            }

            let movieList = await axios({
                url: `${config.apiUrl}/api/movies`,
                headers: { Authorization: `Bearer ${token}` },
                method: 'get',
            });

            movieList = movieList.data.data;

            initialState = {
                user,
                playing: {},
                myList: [],
                trends: movieList,
                originals: movieList,
                searchText: '',
            };
        } catch (error) {
            initialState = {
                user: {},
                playing: {},
                myList: [],
                trends: [],
                originals: [],
                searchText: '',
            };
            console.log(error);
        }
        const isLogged = (initialState.user.id);
        const store = createStore(reducer, initialState);
        const preloadedState = store.getState();
        const html = renderToString(
            <Provider store={store}>
                <StaticRouter location={req.url} context={{}}>
                    <Layout>
                        {renderRoutes(serverRoutes(isLogged))}
                    </Layout>
                </StaticRouter>
            </Provider>
        );

        res.send(render(html, preloadedState));
    } catch (error) {
        next(error)
    }
};

module.exports = main;
