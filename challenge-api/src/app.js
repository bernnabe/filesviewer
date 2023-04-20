const express = require('express');
const cors = require('cors');
const app = express();

const healthRoutes = require('./routes/health')
const filesRoutes = require('./routes/files')

//Cors
app.use(cors());

//Routes
app.use('/api/health', healthRoutes);
app.use('/api/files', filesRoutes);

const SERVER_PORT = 3001

app.listen(SERVER_PORT, () => {
    console.log('app started at port 3001');
});