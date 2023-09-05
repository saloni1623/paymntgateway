const express = require('express');
 const { v4: uuidv4 } = require('uuid');
const router = express.Router()
import Stripe from "stripe"
const stripe = Stripe('sk_test_51KoO9LCzZoqXTpD3qou2HHNJ0gFYJsqRCM2JctxEsy4hLGP21X5JLmAVlKpt1H6f79AhR3aU9cydHs67EtVTYd0W0053SijhAv')
router.post('/placeorder', async(req, res) => {
    const {token, total} = req.body
    console.log("reqqqq",req.body)
    try {
        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id
        })
        const payment = await stripe.charges.create({
            amount : total*100,
            currency: "inr",
            customer: customer.id,
            receipt_email: token.email,
        }, {
            idempotencyKey : uuidv4(),
        })
        if(payment){
            res.send('Payment Success')
        }
        else{
            res.send('payment failed')
        }
    } catch (error) {
        res.status(400).json({
            message:'Something wrong',
            error: error.stack
        })
    }
})
export default router