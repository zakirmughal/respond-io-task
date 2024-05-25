const sgMail = require('@sendgrid/mail');
const Config = require('../../config');

sgMail.setApiKey(Config.sendgrid.apiKey);

const msg = {
  to: Config.adminEmail || 'zakirmughal89@gmail.com',
  from: 'redis@yopmail.com', // Use the email address or domain you verified above
  subject: 'Customer(#CUSTOMER#) want to buy product(#PRODUCT#)',
  text: '',
  html: '',
};

module.exports = async (product, senderName) => {
  msg.subject = `Customer(${senderName}) want to buy product(${product.name})`;
  msg.text = 'Hi, \n' +
    `${senderName} want to buy the product, detail are bellow: \n
    \n
    Product Name: ${product.name} \n
    Product Price: ${product.price} \n
    Product Shipping Fee: ${product.shipping} \n
    Product Description: ${product.description} \n
    \n
    Thanks you 
    `;

  msg.html = '<p>Hi, <br/>' +
    `<strong>${senderName}</strong> want to buy the product, detail are bellow: <br/> 
    <br/>
    Product Name: <strong> ${product.name}</strong> <br/>
    Product Price: <strong>${product.price}</strong> <br/>
    Product Shipping Fee: <strong>${product.shipping}</strong> <br/>
    Product Description: ${product.description}<br/>
    <br/>
    Thanks you` +
    '</p>';

  try {
    await sgMail.send(msg);
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.body)
    }
  }
}
