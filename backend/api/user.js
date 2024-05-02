const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation

    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

    const save = async (req, res) =>{
        const user = { ...req.body }

        if(req.params.id) user.id = req.params.id

        if(!req.originalUrl.startsWith('/users')) delete user.admin
        if(!req.user || !req.user.admin) delete user.admin

        try {
            existsOrError(user.name, 'Nome não informado')
            existsOrError(user.email, 'E-mail não informado')

            const userFromDB = await app.db('users')
                .where({ email: user.email })
                .first()

            if(!user.id) {

                notExistsOrError(userFromDB, 'Usuário já cadastrado')
                existsOrError(user.password, 'Senha não informada')
                existsOrError(user.confirmPassword, 'Confirmação de senha inválida')
                equalsOrError(user.password, user.confirmPassword, 'Senhas não conferem')
                equalsOrError((String(user.password).trim().length >= 6), true, 'Senhas deve ter no mínimo 6 caracteres')

            } else if(user.password && String(user.password).trim().length > 0){

                existsOrError(user.password, 'Senha não informada')
                existsOrError(user.confirmPassword, 'Confirmação de senha inválida')
                equalsOrError(user.password, user.confirmPassword, 'Senhas não conferem')
                equalsOrError((String(user.password).trim().length >= 6), true, 'Senhas deve ter no mínimo 6 caracteres')

            } else {
                delete user.password
                delete user.confirmPassword
            }
        } catch(msg) {
            return res.status(400).send(msg)
        }

        if (user.password) {
            user.password = encryptPassword(user.password)
            delete user.confirmPassword
        }

        if(user.id) {
            app.db('users')
                .update(user)
                .where({ id: user.id })
                .whereNull('deletedAt')
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('users')
                .insert(user)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const get = async (req, res) => {
        app.db('users')
            .select('id','name','email', 'admin')
            .whereNull('deletedAt')
            .then(users => res.json(users))
            .catch(err => res.status(500).send(err))
    }

    const getById = async (req, res) => {

        try {
            existsOrError(req.params.id, 'Id não informado')
        } catch (msg){
            return res.status(400).send(msg)
        }

        app.db('users')
            .select('id','name','email', 'admin')
            .where({ id: req.params.id })
            .whereNull('deletedAt')
            .first()
            .then(user => res.json(user))
            .catch(err => res.status(500).send(err))
    }

    const remove = async (req, res) => {
        try {
            const articles = await app.db('articles')
                .where({userId: req.params.id})

            notExistsOrError(articles, 'Usuário possui artigos.')

            const rowsUpdated = await app.db('users')
                .update({deletedAt: new Date()})
                .where({id: req.params.id})
                .whereNull('deletedAt')

            existsOrError(rowsUpdated,'Usuário não encontrado.')

            res.status(204).send()
        } catch (msg) {
            res.status(400).send(msg)
        }
    }

    return { save, get, getById, remove }
}