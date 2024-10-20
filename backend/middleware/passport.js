const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

module.exports = passport => {
    passport.use(
        new JwtStrategy(options, async (jwt_payload, done) => {
            try {
                const user = await User.findById(jwt_payload.id);
                if (user) return done(null, user);
                return done(null, false);
            } catch (error) {
                console.log(error);
            }
        })
    );
};
