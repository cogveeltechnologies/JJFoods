import { Inject, Injectable, ParseFloatPipe } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Salt } from './schemas/salt.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Order } from 'src/order/schemas/order.schema';
import { ConfigService } from '@nestjs/config';
import { PetPoojaService } from 'src/pet-pooja/pet-pooja.service';
import { CartService } from 'src/cart/cart.service';
var Razorpay = require('razorpay')

@Injectable()
export class RazorpayService {
  constructor(@InjectModel(Salt.name) private saltModel: Model<Salt>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private configService: ConfigService,
    @Inject(PetPoojaService) private readonly petPoojaService: PetPoojaService,
    @Inject(CartService) private readonly cartService: CartService) { }

  async payment(body) {
    const razorpay = await new Razorpay({
      key_id: this.configService.get<string>('RAZORPAY_ID'),
      key_secret: this.configService.get<string>('RAZORPAY_SECRET'),
    });



    const { amount, currency, receipt, orderId } = body
    // return body;
    try {

      const amt = parseFloat(amount)
      const order = await razorpay.orders.create({
        amount: parseFloat(amount) * 100,
        currency,
        receipt,
      });

      //hashing 
      const saltOrRounds = 10;
      const password = parseFloat(amount) + orderId;
      const hash = await bcrypt.hash(password, saltOrRounds);

      const salt = await bcrypt.genSalt();
      // console.log("salt", salt)

      const saltDbItem = new this.saltModel({ orderId, salt: hash })
      await saltDbItem.save()




      return order
    } catch (error) {

      throw new Error(error)
    }
  };

  async fetchPaymentById(body) {
    console.log("fetch payment by id body", body)
    var instance = new Razorpay({
      key_id: this.configService.get<string>('RAZORPAY_ID'),
      key_secret: this.configService.get<string>('RAZORPAY_SECRET'),
    })

    const { orderId, rPaymentId, rSignature, rOrderId } = body
    const saltSaved = await this.saltModel.findOne({ orderId: body.orderId })
    const saltOrRounds = 10;
    const order = await this.orderModel.findById(body.orderId)
    const password = order.grandTotal + orderId
    // const hash = await bcrypt.hash(password, saltOrRounds);
    console.log("saltsaved", saltSaved.salt)
    // console.log("hash", hash)

    const isMatch = await bcrypt.compare(password, saltSaved.salt);
    console.log(isMatch)

    // if (saltSaved.salt !== hash) {
    //   throw new Error('Invalid Password 1')
    // }
    if (!isMatch) {
      throw new Error('Invalid Password 2')
    }








    const razorpayResponse = await instance.payments.fetch(rPaymentId)
    console.log("razorpay response", razorpayResponse)
    const rPassword = razorpayResponse.amount / 100 + body.orderId;
    const isMatchR = await bcrypt.compare(rPassword, saltSaved.salt);

    if (isMatchR) {
      //change payment status
      order.payment.status = true;

      //change order status
      order.state = "processing"

      //save razorpay details in order 
      order.payment.paymentId = rPaymentId
      order.payment.signature = rSignature

      //notify petpooja
      const petPoojaOrderBody = {
        user: order.user,
        products: order.products,
        cgst: order.cgst,
        sgst: order.sgst,
        discount: {
          couponId: order.discount?.couponId,
          discount: order.discount?.discount
        },
        itemsTotal: order.itemsTotal,
        grandTotal: order.grandTotal.toFixed(2),
        deliveryFee: order.deliveryFee,
        platformFee: 15,
        orderPreference: order.orderPreference,
        address: order.address,

        payment: {
          paymentMethod: order.payment.paymentMethod,
          paymentId: rPaymentId,
          status: true
        },
        createdAt: new Date(),
        updatedAt: new Date()


      }
      const petPoojaOrder = await this.petPoojaService.saveOrder(petPoojaOrderBody)
      console.log(petPoojaOrder)

      // console.log(petPoojaOrder.restID)


      // const newOrderBody = { ...orderBody, petPooja: { restId: petPoojaOrder.restID, orderId: petPoojaOrder.orderID, clientOrderId: petPoojaOrder.clientOrderID } }

      // order.petPooja.restId = petPoojaOrder?.restID
      // order['petPooja'].orderId = petPoojaOrder?.orderID
      // order['petPooja'].clientOrderId = petPoojaOrder?.clientOrderID
      if (!order.petPooja) {
        order['petPooja'] = {
          restId: '',
          orderId: '',
          clientOrderId: ''
        };
      }

      // Assign values to the properties of petPooja
      order.petPooja.restId = petPoojaOrder?.restID;
      order.petPooja.orderId = petPoojaOrder?.orderID;
      order.petPooja.clientOrderId = petPoojaOrder?.clientOrderID;



      await order.save();

      //cart empty
      await this.cartService.removeCart({ userId: order.user })



      return { message: "done" }


    }

    //change order status
    order.state = "processing"

    //razorpay 
    //save razorpay details in order 
    order.payment.paymentId = rPaymentId
    order.payment.signature = rSignature
    await order.save()



    return { error: "error" }

  }

  async fetchOrderById(body) {
    var instance = new Razorpay({
      key_id: this.configService.get<string>('RAZORPAY_ID'),
      key_secret: this.configService.get<string>('RAZORPAY_SECRET')
    })

    return await instance.orders.fetch(body.orderId)
  }
}