const Config = require('../../../config');
const {randomIntFromInterval} = require('../../services/utility');
const {senderTypingOn, sendMessage, getSender, sendEmail} = require('../../actions');

// Variables
const greetingsMessages = [
  'Hello #NAME#, How are you?',
  'Hi #NAME#, I hope you\'re doing well?',
  'Hey #NAME#, I hope you\'re having a great day?',
];
const greetingsFilter = [
  'hi',
  'hello',
  'good morning',
];

const queryArray = [
  {command: 'desc', field: 'description', text: 'Description: #desc#'},
  {command: '/desc', field: 'description', text: 'Description: #/desc#'},
  {command: 'price', field: 'price', text: 'Price: #price#'},
  {command: '/price', field: 'price', text: 'Price: #/price#'},
  {command: 'shipping', field: 'shipping', text: 'Shipping: #shipping#'},
  {command: '/shipping', field: 'shipping', text: 'Shipping: #/shipping#'},
];

// Main Export function
module.exports = function makeGetMessages({productsDb}) {
  return async function listAllMessages({body, params, query, principal}, redisClient) {

    if (body.object === 'page') {
      for (const entry of body.entry) {
        for (const event of entry.messaging) {
          const senderID = event.sender.id;
          const message = (event?.message?.text || '').trim();

          // TASK 1 : greeting Messsage
          if (greetingsFilter.indexOf(message) > -1) {
            await senderTypingOn(senderID);
            const sender = await getSender(senderID);
            await sendMessage(senderID, (greetingsMessages[randomIntFromInterval(0, 2)] || '').replace('#NAME#', sender?.first_name || ''))
            return {success: true}
          }

          // TASK 2 : Query Resolver
          const splitMsg = message.split(' ');
          const queryCommand = queryArray.find((cmd) => cmd.command === splitMsg[0].trim());
          const productId = splitMsg[1];
          if (splitMsg.length > 1) {
            if (queryCommand) {
              // get product
              const product = await productsDb(redisClient).findOne(productId);
              if (product && product.name) {
                await senderTypingOn(senderID);
                await sendMessage(senderID, (queryCommand.text || '').replace(`#${queryCommand.command}#`, product[queryCommand.field]))
                return {success: true}
              } else {
                await senderTypingOn(senderID);
                await sendMessage(senderID, "Sorry, Product not found!")
              }
              // TASK 3 : Notification for buying
            } else if (splitMsg[0].trim() === 'buy' || splitMsg[0].trim() === '/buy') {
              // get product
              const product = await productsDb(redisClient).findOne(productId);
              if (product && product.name) {
                const sender = await getSender(senderID);
                await sendEmail(product, sender?.first_name);
                await senderTypingOn(senderID);
                await sendMessage(senderID, "Your request has been proceed, the sale person will contact you soon, Thank you for purchase")
              } else {
                await senderTypingOn(senderID);
                await sendMessage(senderID, "Sorry, Product not found!")
              }
            }
          }

        }
      }
    }

    return {success: true}
  }
};
