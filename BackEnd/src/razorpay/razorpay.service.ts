import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Salt } from './schemas/salt.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Order } from 'src/order/schemas/order.schema';
import { ConfigService } from '@nestjs/config';
var Razorpay = require('razorpay')

@Injectable()
export class RazorpayService {
  constructor(@InjectModel(Salt.name) private saltModel: Model<Salt>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private configService: ConfigService) { }

  async payment(body) {
    const razorpay = await new Razorpay({
      key_id: this.configService.get<string>('RAZORPAY_ID'),
      key_secret: this.configService.get<string>('RAZORPAY_SECRET'),
    });



    const { amount, currency, receipt, orderId } = body
    // return body;
    try {
      const order = await razorpay.orders.create({
        amount: parseInt(amount),
        currency,
        receipt,
      });

      //hashing 
      const saltOrRounds = 10;
      const password = amount + orderId;
      const hash = await bcrypt.hash(password, saltOrRounds);

      const salt = await bcrypt.genSalt();
      console.log("salt", salt)

      const saltDbItem = new this.saltModel({ orderId, salt: hash })
      await saltDbItem.save()




      return order
    } catch (error) {
      return error
      throw new Error(error)
    }
  };

  async fetchPaymentById(body) {
    var instance = new Razorpay({
      key_id: this.configService.get<string>('RAZORPAY_ID'),
      key_secret: this.configService.get<string>('RAZORPAY_SECRET'),
    })
    const saltSaved = await this.saltModel.findOne({ orderId: body.orderId })
    const saltOrRounds = 10;
    const order = await this.orderModel.findById(body.orderId)
    const password = order.grandTotal + body.orderId
    const hash = await bcrypt.hash(password, saltOrRounds);

    const isMatch = await bcrypt.compare(password, saltSaved.salt);

    if (!isMatch) {
      throw new Error('Invalid Password')
    }

    if (saltSaved.salt !== hash) {
      throw new Error('Invalid Password')
    }






    return await instance.payments.fetch(body.paymentId)

  }

  async fetchOrderById(body) {
    var instance = new Razorpay({
      key_id: this.configService.get<string>('RAZORPAY_ID'),
      key_secret: this.configService.get<string>('RAZORPAY_SECRET')
    })

    return await instance.orders.fetch(body.orderId)
  }
}
