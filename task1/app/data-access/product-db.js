const {parseRedisData} = require('../services/utility')
module.exports = (redisClient) => {
  return Object.freeze({
    findOne,
    insert,
    update,
    remove,
    search
  });

  async function findOne(sku) {
    return await redisClient.hgetall(`product:${sku}`);
  }

  async function insert(product) {
    return await Promise.all([
      redisClient.hset(`product:${product.sku}`, product),
    ]);
  }

  async function update(sku, product) {
    return await redisClient.hset(`product:${sku}`, product);
  }

  async function remove(product) {

    return await Promise.all([
      redisClient.del(`product:${product}`),
    ]);

  }

  async function search(keywords, page = 1) {
    const limit = 10;
    const offset = (page - 1) * limit
    let search = '';
    for (let key in keywords) {
      if (keywords[key]) {
        if (keywords[key]['cond'] === 'like') {
          search += ` @${key}:{${keywords[key]['operand'].join('|')}} `;
        } else {
          keywords[key]['operand'].forEach(o => {
            search += ` @${key}:${o}|`;
          })
          search = search.replace(/\|+$/, '');
        }
      }
    }
    const result = await redisClient.call('FT.SEARCH', 'idx:products', search, 'LIMIT', offset, offset + limit);

    if (!result || result.length === 0 || result[0] === 0) {
      return [];
    }

    return parseRedisData(result);
  }
}
