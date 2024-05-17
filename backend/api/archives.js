const fs = require('fs');
const path = require('path');

module.exports = app => {
    const { existsOrError } = app.api.validation

    const save = async (req, res) =>{
        
        try {
            existsOrError(req.files, 'Nenhum arquivo enviado');

            const archives = [];

            for (let file of req.files) {

                let archive = {
                    id: file.filename,
                    name: file.originalname,
                    userId: 1,
                    createdAt: new Date()
                }

                await app.db('archives').insert(archive)

                archives.push({
                    id: file.filename,
                    name: file.originalname
                });
            }

            res.status(201).send(archives);
        } catch (err) {

            res.status(400).send(err);
        }
    }

    const get = async (req, res) => {
        try {
            const { page = 1, limit = 10 } = req.query;

            const archives = await app.db('archives')
                .select('id', 'name')
                .limit(limit)
                .offset((page - 1) * limit);

            res.json(archives);
        } catch (err) {
            res.status(400).send(err);
        }
    };
    const remove = async (req, res) => {

        try {
            existsOrError(req.params.id, 'Código do arquivo não informado');

            const archive = await app.db('archives')
                .where({ id: req.params.id })
                .first();

            existsOrError(archive, 'Arquivo não localizado');

            const filePath = path.join(__dirname, '..', 'archives', archive.name);

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath); // Exclui o arquivo do sistema de arquivos
            }

            await app.db('archives')
                .where({ id: req.params.id })
                .del();

            res.status(204).send();
        } catch (err) {
            res.status(400).send(err);
        }
    }

    const download = async (req, res) => {
        try {
            existsOrError(req.params.filename, 'Nome do arquivo não informado');

            const filePath = path.join('../archives', req.params.filename);

            if (fs.existsSync(filePath)) {
                res.download(filePath, req.params.filename);
            } else {
                res.status(404).send('Arquivo não encontrado');
            }
        } catch (err) {
            res.status(400).send(err);
        }
    };

    return { save, remove, get, download}
}