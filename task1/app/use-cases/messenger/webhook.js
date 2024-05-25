const Config = require('../../../config');
module.exports = function makeCallBackWebhook() {
  return async function listAll({body, params, query}) {

    const token = query["hub.verify_token"];
    const mode = query["hub.mode"];
    const challenge = query["hub.challenge"];

    if (mode && mode === 'subscribe' && token && token === Config.fb.token) {
      console.log("WEBHOOK_VERIFIED");
      return challenge;
    }
    throw new Error('WebHook Verification failed!');
  }
};
