module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation

    const save = async (req, res) => {
        const category = { ...req.body }

        if(req.params.id) category.id = req.params.id

        try{
            existsOrError(category.name, 'Nome não informado')
        } catch (msg) {
            return res.status(400).send(msg)
        }

        if(category.id){
            app.db('categories')
                .update(category)
                .where({ id: category.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('categories')
                .insert(category)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {
        try {
            existsOrError(req.params.id,'Código da categoria não informada')

            const subcategory = await app.db('categories')
                .where({ parentId: req.params.id })
            notExistsOrError(subcategory,'Existem subcategorias vinculadas')

            const articles = await app.db('articles')
                .where({ categoryId: req.params.id })
            notExistsOrError(articles,'Existem artigos vinculados')

            const rowsDeleted = await app.db('categories')
                .where({ id: req.params.id }).del()
            existsOrError(rowsDeleted, 'Categoria não localizada')

            res.status(204).send()
        } catch (msg) {
            return res.status(400).send(msg)
        }
    }

    const withPath = categories =>{

        const getParent = (categories, parentId) => {
            let parent = categories.filter( parent => parent.id === parentId)
            return parent.length ? parent[0] : null
        }

        const categoriesWithPath = categories.map( category => {
            let path = category.name
            let parent = getParent(categories, category.parentId)

            while(parent){
                path = `${parent.name} > ${path}`
                parent = getParent(categories, parent.parentId)
            }

            return { ...category, path }
        })

        categoriesWithPath.sort((a, b) => {
            if(a.path < b.path) return -1
            if(a.path > b.path) return 1
            return 0
        })

        return categoriesWithPath
    }

    const get = async (req, res) => {
        app.db('categories')
        .select('id','name','parentId')
            .then(categories => res.json(withPath(categories)))
            .catch(err => res.status(500).send(err))
    }

    const getById = async (req, res) => {

        try {
            existsOrError(req.params.id, 'Id não informado')
        } catch (msg){
            return res.status(400).send(msg)
        }

        app.db('categories')
            .select('id','name','parentId')
            .where({ id: req.params.id })
            .first()
            .then(category => res.json(category))
            .catch(err => res.status(500).send(err))
    }

    const toTree = (categories, tree) => {
        if(!tree) tree = categories.filter( category => !category.parentId)
        
        tree = tree.map(category => {

            const isChild = children => children.parentId == category.id

            category.children = toTree(categories, categories.filter(isChild))

            return category
        })

        return tree
    }

    const getTree = async (req, res) => {
        app.db('categories')
            .select('id','name','parentId')
            .then(categories => res.json(toTree(categories)))
            .catch(err => res.status(500).send(err))
    }

    return { save, remove, get, getById, getTree }
}