const passport = require('passport');
const boom = require('@hapi/boom');
const axios = require('axios');
const { Strategy: FacebookStrategy } = require('passport-facebook');

const { config } = require('../../../config');

passport.use(
    new FacebookStrategy({
        clientID: config.facebookAppId,
        clientSecret: config.facebookAppSecret,
        callbackURL: '/auth/facebook/callback',
        profileFields: ['id', 'displayName', 'photos', 'email']
    }, async function(accessToken, refreshToken, { _json: profile }, cb) {
        try {
            const { data, status } = await axios({
                url: `${config.apiUrl}/api/auth/sign-provider`,
                method: 'post',
                data: {
                    name: profile.name,
                    email: profile.email,
                    password: profile.id,
                    apiKeyToken: config.apiKeyToken
                }
            });

            if (!data || status !== 200) {
                cb(boom.unauthorized(), false);
            }

            cb(null, data);
        } catch (error) {
            cb(error);
        }
    }
));
