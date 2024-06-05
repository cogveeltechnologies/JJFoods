import { Module, forwardRef } from '@nestjs/common';
import { RazorpayService } from './razorpay.service';
import { RazorpayController } from './razorpay.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SaltSchema } from './schemas/salt.schema';
import { OrderModule } from 'src/order/order.module';
import { OrderSchema } from 'src/order/schemas/order.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Salt', schema: SaltSchema }, { name: 'Order', schema: OrderSchema }]), forwardRef(() => OrderModule)],
  providers: [RazorpayService],
  controllers: [RazorpayController],
  exports: [RazorpayService]
})
export class RazorpayModule { }
