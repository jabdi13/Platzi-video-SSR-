require("@babel/polyfill");
const express = require("express");
const helmet = require('helmet');
const passport = require('passport');
const session = require('express-session');
const boom = require('@hapi/boom');
const cookieParser = require('cookie-parser');
const axios = require('axios');
import webpack from 'webpack';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { renderRoutes } from 'react-router-config';
import { StaticRouter } from 'react-router-dom';
import serverRoutes from '../frontend/routes/serverRoutes';
import reducer from '../frontend/reducers'
import initialState from '../frontend/initialState';
import Layout from '../frontend/components/Layout';
import getManifest from './getManifest';

const { config } = require("./config");

const app = express();

if (config.dev) {
    console.log('Development config');
    const webpackConfig = require('../../webpack.config');
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');
    const compiler = webpack(webpackConfig);
    const serverConfig = { port: config.port, hot: true };

    app.use(webpackDevMiddleware(compiler, serverConfig));
    app.use(webpackHotMiddleware(compiler));
} else {
    app.use((req, res, next) => {
        if (!req.hashManifest) req.hashManifest = getManifest();
        next();
    });
    app.use(express.static(`${__dirname}/public`));
    app.use(helmet());
    app.use(helmet.permittedCrossDomainPolicies());
    app.disable('x-powered-by');
}

// body parser
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
// app.use(session({ secret: config.sessionSecret }));
app.use(passport.initialize());
app.use(passport.session());

// Basic strategy
require('./utils/auth/strategies/basic');

// OAuth strategy
require('./utils/auth/strategies/oauth');

// Google strategy
require('./utils/auth/strategies/google');

// Twitter strategy
// require('./utils/auth/strategies/twitter');

// Linkedin strategy
require('./utils/auth/strategies/linkedin');

// Facebook strategy
require('./utils/auth/strategies/facebook');

const setResponse = (html, preloadedState, manifest) => {
    const mainStyles = manifest ? manifest['main.css'] : 'assets/main.css';
    const mainBuild = manifest ? manifest['main.js'] : 'assets/app.js';
    const vendorBuild = manifest ? manifest['vendors.js'] : 'assets/vendor.js';

    return (`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <link type="text/css" rel="stylesheet" href="${mainStyles}">
        <title>Platzi Video</title>
    </head>
    <body>
        <div id="app">${html}</div>
        <script>
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(
        /</g,
        '\\u003c'
    )}
        </script>
        <script src="${mainBuild}" type="text/javascript"></script>
        <script src="${vendorBuild}" type="text/javascript"></script>
    </body>
    </html>
  `);
};

const renderApp = (req, res) => {
    const store = createStore(reducer, initialState);
    const preloadedState = store.getState();
    const html = renderToString(
        <Provider store={store}>
        <StaticRouter location={req.url} context={{}}>
<Layout>
    {renderRoutes(serverRoutes)}
    </Layout>
    </StaticRouter>
    </Provider>
);

    res.send(setResponse(html, preloadedState, req.hashManifest));
};

app.get('*', renderApp);

app.post("/auth/sign-in", async function(req, res, next) {
  passport.authenticate('basic', function(error, data) {
    const { token, ...user } = data;
    try {
      if (error || !data) {
        next(boom.unauthorized());
      }
      req.login(data, { session: false }, async function(error) {
        if (error) {
          next(error);
        }

        res.cookie('token', token, {
          httpOnly: !config.dev,
          secure: !config.dev
        });

        res.status(200).json(user);
      })
    } catch (error) {
      next(error);
    }
  })(req, res, next);
});

app.post("/auth/sign-up", async function(req, res, next) {
  const { body: user } = req;

  try {
    const { data } = await axios({
      url: `${config.apiUrl}/api/auth/sign-up`,
      method: 'post',
      data: user
    });

    res.status(201).json({
        message: 'user created',
        name: user.name,
        email: user.email,
        id: data.data
    });
  } catch (error) {
    next(error);
  }

});

app.get("/movies", async function(req, res, next) {

});

app.post("/user-movies", async function(req, res, next) {
  try {
    const { body: userMovie } = req;
    const { token } = req.cookies;

    const { data, status } = await axios({
      url: `${config.apiUrl}/api/user-movies`,
      headers: { Authorization: `Bearer ${token}`},
      method: 'post',
      data: userMovie
    });

    if (status !== 201) {
      return next(boom.badImplementation());
    }

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
});

app.delete("/user-movies/:userMovieId", async function(req, res, next) {
  try {
    const { userMovieId } = req.params;
    const { token } = req.cookies;

    const { data, status } = await axios({
      url: `${config.apiUrl}/api/user-movies/${userMovieId}`,
      headers: { Authorization: `Bearer ${token}`},
      method: 'delete'
    });

    if (status !== 200) {
      return next(boom.badImplementation());
    }

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

app.get(
    '/auth/google-oauth',
    passport.authenticate('google-oauth', {
      scope: ['email', 'profile', 'openid']
    })
);

app.get(
    '/auth/google-oauth/callback',
    passport.authenticate('google-oauth',{ session: false }),
    function (req, res, next) {
      if (!req.user) {
        next(boom.unauthorized());
      }

      const { token, ...user} = req.user;

      res.cookie('token', token, {
        httpOnly: !config.dev,
        secure: !config.dev
      });

      res.status(200).json(user);
    }
);

app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["email", "profile", "openid"]
    })
);

app.get(
    "/auth/google/callback",
    passport.authenticate("google", { session: false }),
    function(req, res, next) {
      if (!req.user) {
        next(boom.unauthorized());
      }

      const { token, ...user } = req.user;

      res.cookie("token", token, {
        httpOnly: !config.dev,
        secure: !config.dev
      });

      res.status(200).json(user);
    }
);

app.get('/auth/twitter', passport.authenticate('twitter'));

app.get(
    '/auth/twitter/callback',
    passport.authenticate('twitter', { session: false }),
    (req, res, next) => {
        if (!req.user) {
            next(boom.unauthorized());
        }

        const { token, ...user} = req.user;

        res.cookie('token', token, {
            httpOnly: !config.dev,
            secure: !config.dev,
        });

        res.status(200).json(user);
    }
);

app.get('/auth/linkedin', passport.authenticate('linkedin'));

app.get(
    '/auth/linkedin/callback',
    passport.authenticate('linkedin', { session: false }),
    function (req, res, next) {
        if (!req.user) {
            next(boom.unauthorized());
        }

        const { token, ...user} = req.user;

        res.cookie('token', token, {
            httpOnly: !config.dev,
            secure: !config.dev
        });

        res.status(200).json(user);
    }
);

app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email']}));

app.get(
    '/auth/facebook/callback',
    passport.authenticate('facebook', { session: false }),
    function (req, res, next) {
        if (!req.user) {
            next(boom.unauthorized());
        }

        const { token, ...user } = req.user;

        res.cookie('token', token, {
            httpOnly: !config.dev,
            secure: !config.dev
        });

        res.status(200).json(user);
    }
)

app.listen(config.port, function() {
  console.log(`Listening http://localhost:${config.port}`);
});
