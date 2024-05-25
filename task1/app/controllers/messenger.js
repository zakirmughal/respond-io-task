const {
  webhook,
  getMessages
} = require('../use-cases/messenger');

const callBackWebhook = async function (httpRequest, redisClient) {
  return await webhook(httpRequest, redisClient);
};

const listAllMessages = async function (httpRequest, redisClient) {
  return await getMessages(httpRequest, redisClient);
};

module.exports = {
  callBackWebhook,
  listAllMessages
}
