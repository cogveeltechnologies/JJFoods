import { Inject, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import { Connection, Model } from 'mongoose';
import { Cart } from 'src/cart/schemas/cart.schema';
import { CartService } from 'src/cart/cart.service';
import { Coupon } from 'src/coupon/schemas/coupon.schema';
import { CouponService } from 'src/coupon/coupon.service';
import { User } from 'src/auth/schemas/user.schema';
import { Address } from 'src/auth/schemas/address.schema';
import { PetPoojaService } from 'src/pet-pooja/pet-pooja.service';
import { RazorpayService } from 'src/razorpay/razorpay.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>, @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(User.name) private userModel: Model<User>, @InjectModel(Address.name) private addressModel: Model<Address>,
    @Inject(CartService)
    private readonly cartService: CartService,
    @InjectModel(Coupon.name) private couponModel: Model<Coupon>,
    @Inject(CouponService)
    private readonly couponService: CouponService,
    @Inject(PetPoojaService)
    private readonly petPoojaService: PetPoojaService,
    @Inject(RazorpayService) private readonly razorpayService: RazorpayService,
    private configService: ConfigService,
    @InjectConnection() private connection: Connection,) { }

  async createOrder(body) {
    const { userId, orderPreference } = body;
    // if (!userId) {
    //   console.log("user id not found")
    // }
    const { couponId } = body.discount;

    // const userCartDocument = await this.cartModel.findOne({ user: userId })
    const deliveryFee = 0;

    let discount = 0;

    if (couponId) {
      const data = await this.cartService.getUserCart(userId, undefined)
      const discountBody = {
        couponId,
        userId,
        price: data.itemsTotal
      }
      const userCart = await this.cartService.getUserCart(userId, discountBody)

      discount = userCart.discount
    }



    const data = {
      discount,
      deliveryFee
    }



    const userCart = await this.cartService.getUserCart(userId, data)


    const products = userCart.newData.map((item) => {

      return {
        itemId: item['itemid'],
        quantity: item['quantity'],
        price: item['price']
      }
    })
    let order: any;


    const orderBody = {
      user: userId,
      products,
      cgst: userCart.cgst,
      sgst: userCart.sgst,
      discount: {
        couponId,
        discount
      },
      itemsTotal: userCart.itemsTotal,
      grandTotal: userCart.grandTotal?.toFixed(2),
      deliveryFee: userCart.deliveryFee,
      platformFee: 15,
      orderPreference,
      address: body.address ? body.address : undefined,

      payment: {
        paymentMethod: body.payment.paymentMethod,
        paymentId: body.payment?.paymentId,
        status: false
      },
      createdAt: new Date(),
      updatedAt: new Date()


    }

    const petPoojaOrderBody = {
      user: await this.userModel.findOne({ _id: userId }),
      products,
      cgst: userCart.cgst,
      sgst: userCart.sgst,
      discount: {
        couponId,
        discount
      },
      itemsTotal: userCart.itemsTotal,
      grandTotal: userCart.grandTotal.toFixed(2),
      deliveryFee: userCart.deliveryFee,
      platformFee: 15,
      orderPreference,
      address: body.address ? await this.addressModel.findOne({ _id: body.address }) : undefined,

      payment: {
        paymentMethod: body.payment.paymentMethod,
        paymentId: body.payment?.paymentId,
        status: false
      },
      createdAt: new Date(),
      updatedAt: new Date()


    }
    // console.log("ppob", petPoojaOrderBody)
    if (orderBody.payment.paymentMethod === 'online') {
      order = new this.orderModel(orderBody);
      await order.save();
    }
    else {
      const petPoojaOrder = await this.petPoojaService.saveOrder(petPoojaOrderBody)

      // console.log(petPoojaOrder.restID)


      const newOrderBody = { ...orderBody, petPooja: { restId: petPoojaOrder.restID, orderId: petPoojaOrder.orderID, clientOrderId: petPoojaOrder.clientOrderID } }



      order = new this.orderModel(newOrderBody);
      await order.save();
    }

    if (order.payment.paymentMethod === "online") {


      const razorpayBody = {
        amount: orderBody.grandTotal,
        currency: 'INR',
        receipt: "food",
        orderId: order._id
        //check if salt we can send
      }

      const razorpay = await this.razorpayService.payment(razorpayBody);

      order.payment.orderId = razorpay.id;
      await order.save()

      const user = await this.userModel.findById(userId)

      return {
        order: order._id,
        key: this.configService.get<string>('RAZORPAY_ID'),
        amount: parseFloat(orderBody.grandTotal),
        name: "JJFOODS",
        description: "wazwan",
        currency: "INR",
        order_id: razorpay.id,
        prefill: {
          email: user.emailId,
          contact: user.phoneNumber,
          name: user.name
        }


      }
    }
    else {
      await this.cartService.removeCart({ userId: order.user })

      return order
    }

  }

  async updateOrderState(orderId: string, newState: string) {
    return this.orderModel.findByIdAndUpdate(orderId, { state: newState, updatedAt: Date.now() }, { new: true }).exec();
  }

  async updateOrderStateCod(orderId: string) {
    return this.orderModel.findByIdAndUpdate(orderId, { state: "processing", updatedAt: Date.now() }, { new: true }).exec();

    //petpooja

  }

  // async updateOrderStatus(orderId: string, newStatus: string) {
  //   return this.orderModel.findByIdAndUpdate(orderId, { status: newStatus, updatedAt: Date.now() }, { new: true }).exec();
  // }

  async getOrdersByCustomerId(userId, state) {
    // const response = await this.orderModel.find({ user: userId, state: state }).exec();
    // return response;
    let queryStates;
    if (state === 'running') {
      queryStates = ['processing', 'ready', 'on the way', 'pending'];
    } else if (state === 'history') {
      queryStates = ['completed', 'cancelled'];
    } else {
      // If the state doesn't match 'running' or 'history', return an empty array or handle accordingly
      return [];
    }

    // Query the database with the mapped states
    const orders = await this.orderModel.find({ user: userId, state: { $in: queryStates } }).exec();
    // return response;
    for (const order of orders) {
      for (const product of order.products) {

        const item = await this.connection.db.collection('items').findOne({ itemid: product.itemId });


        if (item) {
          product.details = item

        }
      }
    }
    console.log(orders)
    return orders;
  }

  async getOrdersByCustomerIdAdmin(user, state) {
    const response = await this.orderModel.find({ user, state }).exec();
    // return response;

  }

  async getOrderById(orderId: string) {
    return this.orderModel.findById(orderId).exec();
  }
}