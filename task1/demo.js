const Redis = require('ioredis');
const Config = require('./config');
let fs = require("fs");

// 1. Subscribe the permission on the page
const subscribePermission = async () => {
  const url = `${Config.fb.baseURL}/${Config.fb.apiVersion}/${Config.fb.pageId}/subscribed_apps`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      access_token: Config.fb.pageAccessToken,
      subscribed_fields: "messages"
    }
  };

  try {
    const {data} = await axios.post(url, {}, config);
    return data;
  } catch ({response}) {
    console.log(response.data.error.message);
  }
}

// 2. Create Command on Messenger
const messengerCommand = async () => {
  const url = `${Config.fb.baseURL}/${Config.fb.apiVersion}/me/messenger_profile`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      access_token: Config.fb.pageAccessToken
    }
  };
  const payload = {
    "commands": [
      {
        "locale": "default",
        "commands": [
          {
            "name": "desc",
            "description": "Get description of product."
          },
          {
            "name": "price",
            "description": "Get price of product."
          },
          {
            "name": "shipping",
            "description": "Get shipping fee of product"
          },
          {
            "name": "buy",
            "description": "Buy the product, email send to admin."
          }
        ]
      }
    ]
  };

  try {
    const {data} = await axios.post(url, payload, config);
    return data;
  } catch ({response}) {
    console.log(response.data.error.message);
  }
}


const redisClient = new Redis({
  host: Config?.redis?.host || process.env.REDIS_HOST || 'localhost',
  port: Config?.redis?.port || process.env.REDIS_PORT || 6379,
  password: Config?.redis?.password || process.env.REDIS_PASSWORD
});

// 3. Create Indexes on Redis
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

const redisDemo = async () => {
  // flush indexes
  await flushDatabase();
  // create indexes
  await createIndices();
  let defaultContents = fs.readFileSync('./products.json');
  let defaultJson = JSON.parse(defaultContents);
  for (const row of defaultJson) {
    row.category = JSON.stringify(row.category);
    await redisClient.hset(`product:${row.sku}`, row);
  }
  redisClient.quit();
};


// 1. Subscribe permission
subscribePermission();

// 2. Messenger Command
messengerCommand();

// 3. Dump Data
redisDemo();
