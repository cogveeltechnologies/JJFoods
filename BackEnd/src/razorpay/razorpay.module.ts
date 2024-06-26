import { Module, forwardRef } from '@nestjs/common';
import { RazorpayService } from './razorpay.service';
import { RazorpayController } from './razorpay.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SaltSchema } from './schemas/salt.schema';
import { OrderModule } from 'src/order/order.module';
import { OrderSchema } from 'src/order/schemas/order.schema';
import { ConfigModule } from '@nestjs/config';
import { PetPoojaModule } from 'src/pet-pooja/pet-pooja.module';
import { CartModule } from 'src/cart/cart.module';

@Module({
  imports: [ConfigModule, MongooseModule.forFeature([{ name: 'Salt', schema: SaltSchema }, { name: 'Order', schema: OrderSchema }]), forwardRef(() => OrderModule), forwardRef(() => PetPoojaModule), CartModule],
  providers: [RazorpayService],
  controllers: [RazorpayController],
  exports: [RazorpayService]
})
export class RazorpayModule { }
