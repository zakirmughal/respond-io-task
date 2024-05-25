const axios = require('axios');
const Config = require('../../config');

module.exports = async (recipientId) => {
  const url = `${Config.fb.baseURL}\\${Config.fb.apiVersion}\\me/messages`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      access_token: Config.fb.pageAccessToken
    }
  };
  const data = {
    recipient: {id: recipientId},
    "sender_action": "typing_on"
  };

  try {
    await axios.post(url, data, config);
  } catch ({response}) {
    throw new Error(response.data.error.message);
  }
}
