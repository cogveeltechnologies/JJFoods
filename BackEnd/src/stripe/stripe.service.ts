import { Injectable } from '@nestjs/common';
import { StripeDto } from './dtos/stripe.dto';

const stripe = require('stripe')('sk_test_51P8d8QSA6deqhATd0ob3Ohu23ku9H7O4JBscejmZUkqzTl9EFStuJPA1VJnW3wmSVSUZSX9acesRt4F8eXZJs7SV00sPZZNuo3')
@Injectable()
export class StripeService {

  failed() {
    return 'failed'
  }

  async payment(body: StripeDto[], couponId) {
    const lineItems = body.map((product) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: product.name
          // images: [product?.image]

        },
        unit_amount: Math.round(product.price * 100)
      },
      quantity: product.quantity
    }))

    // const couponId = '66503e8f4737426beb4a4c20';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      discounts: [{ coupon: couponId }],
      success_url: "http://localhost:3000/stripe/pay/success/checkout/session?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:3000/stripe/pay/failed/checkout/session"

    })
    return session

  }

  async SuccessSession(Session) {

    // console.log(Session);


  }
}
