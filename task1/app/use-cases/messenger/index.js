const makeCallBackWebhook = require('./webhook');
const makeGetMessages = require('./messages');

const {productsDb} = require('../../data-access');

const webhook = makeCallBackWebhook({});
const getMessages = makeGetMessages({productsDb});

module.exports = {
  webhook,
  getMessages
}
