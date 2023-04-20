const express = require('express');
const filesController = require('./../controllers/filesController'); 

const filesRouter = express.Router();

filesRouter.get('/data', async (req, res) => {
    const files = await filesController.getFilesDataWithCircuitBreaker.execute(req.query.fileName)
        .then(data => {
            res.json({ files: data });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: 'Error fetching files' });
        });
});

filesRouter.get('/list', async (req, res) => {
    const files = await filesController.getFilesWithCircuitBreaker.execute()
        .then(data => {
            res.json({ files: data });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: 'Error fetching files' });
        });
});

module.exports = filesRouter;