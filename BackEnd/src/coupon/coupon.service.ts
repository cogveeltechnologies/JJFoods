import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';
import { Coupon } from './schemas/coupon.schema';
import { Used } from './schemas/used.schema';
import { Cart } from 'src/cart/schemas/cart.schema';
import { CartService } from '../cart/cart.service';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class CouponService {
  constructor(@InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Coupon.name) private couponModel: Model<Coupon>,
    @InjectModel(Used.name) private usedModel: Model<Used>,
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @Inject(CartService)
    private readonly cartService: CartService,
    @Inject(NotificationService)
    private readonly notificationService: NotificationService) { }


  async createCoupon(body) {
    const coupon = new this.couponModel(body);
    const notificationBody = {
      title: body.title,
      body: body.description,
      data: body.code
    }
    await this.notificationService.sendPushNotificationsToUsers(notificationBody)

    return coupon.save();
  }
  async decreaseUsage(body) {

    console.log("coupon body", body)
    const promotionalCode = await this.couponModel.findById(body.couponId).exec();
    if (!promotionalCode) {
      throw new Error('Promotional code not found');
    }
    const currentDate = new Date();
    if (currentDate < promotionalCode.validFrom || currentDate > promotionalCode.validTo) {
      throw new BadRequestException('Coupon is not valid at this time');
    }

    if (promotionalCode.usageLimit <= 0) {
      throw new Error('Usage limit exceeded');
    }

    const user = await this.usedModel.findOne({ code: body.couponId, user: body.userId }).exec();
    console.log(user)
    if (user) {
      throw new Error('Coupon already used');
    }
    if (body.price < promotionalCode.minimumOrder && body.price > promotionalCode.maximumOrder) {
      throw new Error('Minimum/Maximum order not met');
    }




    // const usedUser = new this.usedModel({ code: body.couponId, user: body.userId });

    // await usedUser.save()

    // promotionalCode.usageLimit--;

    // await promotionalCode.save();
    if (promotionalCode.isPercent) {
      const discount = body.price * promotionalCode.discountAmount / 100
      return await this.cartService.getUserCart(body.userId, { discount })
    }
    else {
      const discount = promotionalCode.discountAmount;
      return await this.cartService.getUserCart(body.userId, { discount })

    }
  }

  async findAll(userId) {

    const allCoupons = await this.couponModel.find().exec();
    const usedCoupons = await this.usedModel.find({ user: userId })

    const usedCouponCodes = usedCoupons.map((used) => {
      return used.code
    })

    // Fetch all coupons that are not used
    const availableCoupons = await this.couponModel.find({
      _id: { $nin: usedCouponCodes },
    }).exec();

    return availableCoupons;
  }
}
