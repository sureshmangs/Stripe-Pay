const express = require('express');
const cors = require("cors");
const { uuid } = require('uuidv4');
const dotenv = require("dotenv");
dotenv.config();
const stripe = require('stripe')(process.env.STRIPE_SC_KEY);

const app = express();

app.use(express.json());
app.use(cors());


app.post('/payment', (req, res) => {
  const { product, token } = req.body;
  const idempotencyKey = uuid()

  try {
    return stripe.customers.create({
      email: token.email,
      source: token.id
    }).then(customer => {
      stripe.charges.create({
        amount: product.price * 100,
        currency: 'INR',
        customer: customer.id,
        receipt_email: token.email,
        description: `Purchase of ${product.name}`,
      }, { idempotencyKey })
    }).then((result) => {
      res.status(200).json({
        "success": true
      })
    })
      .catch(err => console.log('error occured ', err))
  } catch (err) {
    console.log('error is ', err)
  }

})


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Running on port', PORT);
});