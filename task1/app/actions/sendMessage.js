const axios = require('axios');
const Config = require('../../config');

module.exports = async (recipientId, message) => {
  const url = `${Config.fb.baseURL}\\${Config.fb.apiVersion}\\me/messages`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      access_token: Config.fb.pageAccessToken
    }
  };
  const payload = {
    recipient: {id: recipientId},
    message: {text: message}
  };

  try {
    const {data} = await axios.post(url, payload, config);
    return data;
  } catch ({response}) {
    throw new Error(response.data.error.message);
  }
}
