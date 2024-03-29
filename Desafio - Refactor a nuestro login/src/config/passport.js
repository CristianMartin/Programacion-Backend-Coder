import local from 'passport-local';
import GithubStrategy from 'passport-github2';
import passport from 'passport';
import { createHash, validatePassword } from '../utils/bcrypt.js';
import { userModel } from '../models/user.models.js';

const LocalSrategy = local.Strategy;

const initializePassport = () => {

    passport.use('register', new LocalSrategy({
        passReqToCallback: true,
        usernameField: 'email'}, 
        async (req, username, password, done) => {
            const {first_name, last_name, email, age} = req.body;

            try {
                const user = await userModel.findOne({ email: email});

                if(user) {
                    return done(null, false);
                }

                const passwordHash = createHash(password);
                const userCreated = await userModel.create({
                    first_name: first_name,
                    last_name: last_name,
                    age: age,
                    email: email,
                    password: passwordHash
                });

                return done(null, userCreated);

            } catch(error) {
                return done(error);
            }
        }
    ))

    passport.use('login', new LocalSrategy(
        { usernameField: 'email' }, async(username, password, done) => {
            try {
                const user = await userModel.findOne({email: username});

                if(!user) {
                    return done(null, false);
                }

                if(validatePassword(password, user.password)) {
                    return done(null, user);
                }

                return done(null, false);

            } catch(error) {
                return done(error);
            }
        }
    ));

    passport.use('github', new GithubStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await userModel.findOne({ email: profile._json.email });

            if(user) {
                done(null, false)
            } else {
                const userCreated = await userModel.create({
                    first_name: profile._json.name,
                    last_name: ' ',
                    email: profile._json.email,
                    age: 18,
                    password: createHash(profile._json.email + profile._json.name)
                })

                return done(null, userCreated);
            }
        } catch (error) {
            done(error);
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id);
    })

    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id);
        done(null, user);
    })
}

export default initializePassport;