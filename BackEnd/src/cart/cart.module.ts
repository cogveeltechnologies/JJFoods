import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CartItemSchema, CartSchema } from './schemas/cart.schema';
import { UserSchema } from 'src/auth/schemas/user.schema';
import { DeliverySchema } from './schemas/delivery.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Cart', schema: CartSchema }, { name: 'User', schema: UserSchema }, { name: 'CartItem', schema: CartItemSchema }, { name: 'Delivery', schema: DeliverySchema }])],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService]
})
export class CartModule { }
