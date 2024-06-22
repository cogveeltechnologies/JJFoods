import { Body, Controller, Post } from '@nestjs/common';
import { RazorpayService } from './razorpay.service';

@Controller('razorpay')
export class RazorpayController {
  constructor(private readonly razorpayService: RazorpayService) { }

  @Post()
  async payment(@Body() body) {
    return this.razorpayService.payment(body)
  }

  @Post('/fetchPaymentById')
  async fetchPaymentById(@Body() body) {
    // console.log("api--------------------------------------------------------------------------------------", body)
    return this.razorpayService.fetchPaymentById(body)
  }

  @Post('handleFailure')
  async handleFailure(@Body() body) {
    return this.razorpayService.handleFailure(body)
  }

  @Post('/fetchOrderById')
  async fetchOrderById(@Body() body) {

    return this.razorpayService.fetchOrderById(body)
  }
}
