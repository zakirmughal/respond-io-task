const axios = require('axios');
const Config = require('../../config');

module.exports = async (recipientId) => {
  const url = `${Config.fb.baseURL}\\${Config.fb.apiVersion}\\${recipientId}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      access_token: Config.fb.pageAccessToken
    }
  };

  try {
    const {data} = await axios.get(url, config);
    return data;
  } catch ({response}) {
    throw new Error(response.data.error.message);
  }
}
