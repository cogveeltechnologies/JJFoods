import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PetPoojaModule } from './pet-pooja/pet-pooja.module';
import { CartModule } from './cart/cart.module';
import { FeedbackModule } from './feedback/feedback.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { CouponModule } from './coupon/coupon.module';
import { OrderModule } from './order/order.module';
import { StripeModule } from './stripe/stripe.module';
import { RazorpayModule } from './razorpay/razorpay.module';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: '.env',
    isGlobal: true
  }),
  MongooseModule.forRoot(process.env.MONGO_URL),
  AuthModule,
  PetPoojaModule,
  CartModule,
  FeedbackModule,
  WishlistModule,
  CouponModule,
  OrderModule,
  StripeModule,
  RazorpayModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
