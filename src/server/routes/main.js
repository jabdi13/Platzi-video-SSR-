import { createStore } from "redux";
import reducer from "../../frontend/reducers";
import initialState from "../../frontend/initialState";
import { renderToString } from "react-dom/server";
import {Provider} from "react-redux";
import { StaticRouter } from "react-router-dom";
import Layout from "../../frontend/components/Layout";
import { renderRoutes } from "react-router-config";
import serverRoutes from "../../frontend/routes/serverRoutes";
import React from "react";
import render from '../render';

const main = (req, res, next) => {
    try {
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
