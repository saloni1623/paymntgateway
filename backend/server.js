const express = require("express");
const {v5: uuid} =require("uuid")
const app = express();
const cors = require('cors');
 app.use(cors());
 /*stripe*/
const { resolve } = require("path");
// Replace if using a different env file or config
const env = require("dotenv").config({ path: "./.env" });

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-08-01",
});

app.use(express.static(process.env.STATIC_DIR));
app.use(express.json());

app.get("/", (req, res) => {
  const path = resolve(process.env.STATIC_DIR + "/index.html");
  res.sendFile(path);
});

app.get("/config", (req, res) => {
  
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
  
});

app.post("/create-payment-intent", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency:req.body.currency,
      amount: req.body.amount * 100,
      //  automatic_payment_methods: { enabled: true },
    });
    // Send publishable key and PaymentIntent details to client
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    console.log(e)
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
});
/*cashfree*/
app.post('/api/payment', (req, res) => {
  const sdk = require('api')('@cashfreedocs-new/v3#9qqu7am5li0449pa');

  sdk.createPaymentLink({
    customer_details: {customer_phone: '9999999999'},
    link_notify: {send_sms: false, send_email: false},
    link_id:`${Math.floor(Math.random() * 100000)}`, 
    link_amount: 100,
    link_currency: 'INR',
    link_purpose: 'test'
  }, {
    'x-client-id': 'TEST399278ca3a7a3a31e7db4752e1872993',
    'x-client-secret': 'TEST26e594cb46b13475e1620375e85dc1ccadbf9d',
    'x-api-version': '2022-09-01'
  })
  .then(({ data }) => {
    console.log(data)
  
    res.json({ paymentLink: data.link_url });
  })
  .catch(err => console.error(err));
})


/*payUMoney*/

  const bodyParser = require('body-parser');
const port = 5001; // Replace this with your desired port number
const crypto = require('crypto');
const axios = require('axios');
// const cors = require('cors');
// const corsOptions ={
//     origin:'http://localhost:3000', 
//     credentials:true,            //access-control-allow-credentials:true
//     optionSuccessStatus:200
// }
// app.use(cors(corsOptions));

// Endpoint to generate the hash for PayUMoney payment
app.post('/generate-payment-hash', (req, res) => {
  const data = req.body;

  // Construct the string to hash
  const hashString = `${data.key}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|||||||||||${data.salt}`;

  // Generate the hash using SHA512
  const hash = crypto.createHash('sha512').update(hashString).digest('hex');

  // Return the hash in the response
  res.json({ hash });
  console.log(  res.json({ hash }))
});

// Endpoint to handle PayUMoney payment response
app.post('/payment-response', (req, res) => {
  const responseData = req.body;

  // Validate the payment response received from PayUMoney
  // Perform necessary actions based on the payment status (success or failure)

  if (responseData.status === 'success') {
    // Payment success handling logic
    // Update your database or perform any other required actions
    res.redirect('http://localhost:3000/payment-success'); // Redirect to your frontend success page
  } else {
    // Payment failure handling logic
    // Update your database or perform any other required actions
    res.redirect('http://localhost:3000/payment-failure'); // Redirect to your frontend failure page
  }
});

/*razorpay*/
const Razorpay = require('razorpay');

// Initialize Razorpay with your key id and key secret
const rp_secret = 'VHg2IOSiYiYYIbgYUa5uhQxm'
const razorpay = new Razorpay({
  key_id: "rzp_test_NZo2nnA4c0RM3R",
  key_secret: rp_secret
});
var { validatePaymentVerification, validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils');


// Endpoint to create a new order

app.post('/create-order', async (req, res) => {

  const options = {
    amount: 400 * 100, // Amount in paise (example: 10000 paise = ₹100)
    currency: 'INR',
    receipt: 'order_receipt',
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
   
    res.status(500).send('Error creating order');
  }
});

// Endpoint to verify payment
app.post('/verify-payment', async (req, res) => {
 
  try {
    // const { order_id, payment_id, signature } = req.body;
    // Verify the payment signature
   
    const attributes = req.body.order_id + '|' + req.body.payment_id;
    const isSignatureValid = validatePaymentVerification({"order_id": req.body.order_id, "payment_id": req.body.payment_id }, req.body.signature, rp_secret);

    if (isSignatureValid) {
      // Payment verified, handle your logic here
      res.json({ message: 'Payment verified' });
    } else {
      res.status(400).json({ error: 'Invalid payment signature' });
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Something went wrong' });
  }
});




/*paytm*/


app.post('/generateOrderId', (req, res) => {
  // Generate a unique order ID based on your logic (e.g., timestamp + random number)
  const orderId = Date.now().toString() + Math.floor(Math.random() * 10000);

  return res.json({ orderId });
});


const nodeCCAvenue = require('node-ccavenue');
const ccav = new nodeCCAvenue.Configure({
  merchant_id: "2734568",
  working_key: "ED143ABB32A61FAF6E0B76BC715BC3DA",
});






function generateChecksum(data, workingKey) {
  const keys = Object.keys(data).sort();
  const values = keys.map(key => data[key]);
  const joinedValues = values.join('|');
  const hmac = crypto.createHmac('sha256', workingKey);
  hmac.update(joinedValues);
  return hmac.digest('hex');
}




app.use(bodyParser.urlencoded({ extended: true }));

const merchantId = '2734568';
const accessCode = 'AVDI96KH78AO56IDOA';
const workingKey = 'ED143ABB32A61FAF6E0B76BC715BC3DA';

app.post('/generateChecksum', (req, res) => {
  const data = req.body;
  const keys = Object.keys(data);
  keys.sort();

  let checksumData = '';

  keys.forEach((key) => {
    checksumData += `${key}=${data[key]}&`;
  });
  

  checksumData += workingKey;
  const checksum = crypto.createHash('sha256').update(checksumData).digest('hex');

  res.json({ checksum });
});


/*PhonePay*/
app.post('/api/initiate-payment',async (req, res) => {
  try {
   
    // let payload = req.body.payload + '/pg/v1/pay0085a7b1-2601-4fcb-af02-4082cb7fac79'
    // let payload1 = req.body.payload
    const saltKey = '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399';
    const saltIndex = 1;
    const jsonString = JSON.stringify(req.body);
    const payload1 = Buffer.from(jsonString).toString('base64');
  
    const payload = `${payload1}/pg/v1/pay${saltKey}`;
    // let xverify = crypto.createHash('sha256').update(salt).digest('hex');
    // xverify=`${xverify}###${saltIndex}`;
    const hashBuffer =  crypto.createHash('SHA256').update(payload).digest('hex');
    const xverify = hashBuffer + '###' + 1;
 console.log("xverify =",xverify)
 console.log("payload = ",payload1)
    
        const response = await axios.post(
            "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay",
            { request: payload1}, {
            headers: {
                'Content-Type': 'application/json',
                //'X-MERCHANT-ID': 'PGTESTPAYUAT103',
                'X-VERIFY':xverify,
                'accept': 'application/json'
            }
        }
        );
        const url = response.data.data.instrumentResponse.redirectInfo.url
        return res.send({ data: url, status: true });
  
}

catch (error) {
    console.log("error123", error)
}

}
)

// Handle payment callbacks from PhonePe
app.post('/api/payment-callback', (req, res) => {
  // Handle payment callback logic here
});
 


app.listen(8080, () => {
  console.log(`Server is running on port ${8080}`);
});


 
  
