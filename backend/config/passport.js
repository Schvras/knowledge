const passport = require('passport')
const passportJwt = require('passport-jwt')
const { Strategy, ExtractJwt } = passportJwt

module.exports = app => {
    const params = {
        secretOrKey: process.env.AUTH_SECRET  || '',
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }

    const strategy = new Strategy(params, (payload, done) => {
        app.db('users')
            .where({id: payload.id})
            .first()
            .then(user => done(null, user? {...payload}: false))
            .catch(err => done(err, false))
    })

    passport.use(strategy)

    return {
        user: passport,
        authenticate: () => passport.authenticate('jwt', {session: false})
    }
}