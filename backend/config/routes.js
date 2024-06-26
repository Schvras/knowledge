const admin = require('./admin')
const multer = require('multer')({ dest: './archives/' });

module.exports = app => {
    app.get('/', (req, res) => res.send('Hello word!'))

    app.post('/signup', app.api.user.save)
    app.post('/signin', app.api.auth.signin)
    app.post('/validateToken', app.api.auth.validateToken)

    app.route('/users')
        .all(app.config.passport.authenticate())
        .post(admin(app.api.user.save))
        .get(admin(app.api.user.get))

    app.route('/users/:id')
        .all(app.config.passport.authenticate())
        .put(admin(app.api.user.save))
        .get(admin(app.api.user.getById))
        .delete(admin(app.api.user.remove))

    app.route('/categories')
        .all(app.config.passport.authenticate())
        .post(admin(app.api.category.save))
        .get(admin(app.api.category.get))

    // Tem que ser antes de '/categories/:id'
    app.route('/categories/tree')
        .all(app.config.passport.authenticate())
        .get(app.api.category.getTree)

    app.route('/categories/:id')
        .all(app.config.passport.authenticate())
        .put(admin(app.api.category.save))
        .get(app.api.category.getById)
        .delete(admin(app.api.category.remove))

    app.route('/articles')
        .all(app.config.passport.authenticate())
        .post(admin(app.api.articles.save))
        .get(admin(app.api.articles.get))

    app.route('/articles/:id')
        .all(app.config.passport.authenticate())
        .put(admin(app.api.articles.save))
        .get(app.api.articles.getById)
        .delete(admin(app.api.articles.remove))

    app.route('/categories/:id/articles')
        .all(app.config.passport.authenticate())
        .get(app.api.articles.getByCategory)

    app.route('/archives')
        .all(app.config.passport.authenticate())
        .post(multer.array('file'), admin(app.api.archives.save))
        .post(admin(app.api.archives.remove))
        .get(admin(app.api.archives.get))

    app.route('/archives/:filename')
        .all(app.config.passport.authenticate())
        .post(admin(app.api.archives.remove))
        .get(app.api.archives.download)

    app.route('/stats')
        .all(app.config.passport.authenticate())
        .get(app.api.stat.get)
}