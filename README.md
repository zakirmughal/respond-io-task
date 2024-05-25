# Messenger Boot

Connect to facebook messenger API to create chat bot.
The bot can do this task.
1-> Send greeting message
2-> Send product detail
3-> Notify admin for purchasing the product

# Short Description
so basically this project is the chat bot app which is using redis for database because that the challenge that create a chat app with using redis.
The technologies which we used in this project.
 * Redis for database.
 * Nodjs for backend.
 * SendGrid for emaul.

Some packages which used in project to help in dev.
 * ioredis for redis client in nodejs
 * express for server.
 * bunyan for nicely viewing logs.
 * sendgrid/mail for email.

# Get Started
If you want to use API of this project on your APP or web. you can easily use it.
but before going to use API you need to do some setting on your project like.

Navigate `task1->config->config.json`. Open that file in any editor basically this is setting of your app.

Need to you value respectively.
 ```bash
"fb":{
    "baseURL": "https://graph.facebook.com",
    "apiVersion": "v20.0",
    "pageId": "YOUR-PAGE_ID",
    "pageAccessToken": "YOUR-PAGE-ACCESS",
    "token": "YOUR-TOKEN"
  },
  "redis":{
    "host": "YOUR-CONNECTION-STRING",
    "port": 11562,
    "username": "default",
    "password": "YOUR-PASSWORD",
    "dbname": "YOUR_DB-NAME"
  },
  "sendgrid": {
    "host": "https://api.sendgrid.com/v3/",
    "apiKeyID": "YOUR-API-KEY-ID",
    "apiKey": "YOUR-API-KEY"
  },
  "adminEmail": "YOUR-EMAIL"
 ```

 ## Setup Sample Data
 After setup the config you should need to run `demo.js` file by this command `node demo.js`, it will create index and dump data in radis

 ## Run Project
After run `demo.js`, your project is ready to run, use this command to run `npm run dev`

## NgRok
Facebook hook you must run ngrok because facebook messenger api will not work in `http://localhost`
