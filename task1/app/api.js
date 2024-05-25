require('dotenv').config();
const express = require('express');
const router = express.Router();
const redis = require('ioredis');
const makeExpressCallback = require('./make-callback');

const Config = require('../config');

const redisClient = new redis({
  host: Config?.redis?.host || process.env.REDIS_HOST || 'localhost',
  port: Config?.redis?.port || process.env.REDIS_PORT || 6379,
  password: Config?.redis?.password || process.env.REDIS_PASSWORD
});
// create indices
const createIndices = async () => {
  await Promise.all([
    redisClient.call(
      'FT.CREATE',
      'idx:products', 'ON', 'HASH',
      'PREFIX',
      '1',
      'product',
      'SCHEMA',
      'sku', 'NUMERIC', 'SORTABLE',
      'name', 'TEXT', 'SORTABLE',
      'type', 'TAG', 'SORTABLE',
      'price', 'NUMERIC', 'SORTABLE',
      'upc', 'TEXT',
      'shipping', 'NUMERIC', 'SORTABLE',
      'description', 'TEXT',
      'manufacturer', 'TEXT',
      'model', 'TAG', 'SORTABLE',
      'url', 'TEXT',
      'image', 'TEXT',
      'category', 'TEXT'
    ),
  ]);
};

const flushDatabase = async () => {
  await redisClient.flushdb();
};

// flushDatabase();

//controller
const webHookController = require('./controllers/messenger');
module.exports = () => {

  router.route('/messenger-webhook').get(makeExpressCallback(webHookController.callBackWebhook, redisClient));
  router.route('/messenger-webhook').post(makeExpressCallback(webHookController.listAllMessages, redisClient));

  return router;
}
