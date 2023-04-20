const express = require('express');
const healthRouter = express.Router();

const health = (req, res) => {
  const result = 'Pong'

  res.json(result);
};

healthRouter.get('/ping', health);

module.exports = healthRouter