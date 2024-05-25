const randomIntFromInterval = (min, max) => { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function parseRedisData(rawData) {
  let response = [];
  for (let i = 1; i < rawData.length; i += 2) {
    let d = {_id: rawData[i], timestamp: rawData[i].split(':')[1].split('-')[0]};
    for (let j = 0; j < rawData[i + 1].length; j += 2) {
      if (rawData[i + 1][j] === 'password') {
        continue;
      }
      d[rawData[i + 1][j]] = rawData[i + 1][j + 1];
    }
    response.push(d)
  }
  return response;
}

module.exports = {
  randomIntFromInterval,
  parseRedisData
}
