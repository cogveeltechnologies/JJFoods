import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post('/createOrder')
  async createOrder(@Body() body) {
    console.log("order:---------------------------", body)
    return this.orderService.createOrder(body);
  }

  @Put('state/:orderId')
  async updateOrderState(@Param('orderId') orderId: string, @Body('state') state: string) {
    return this.orderService.updateOrderState(orderId, state);
  }
  @Put('state/cod/:orderId')
  async updateOrderStateCod(@Param('orderId') orderId: string) {
    return this.orderService.updateOrderStateCod(orderId);
  }
  // @Put('status/:orderId')
  // async updateOrderStatus(@Param('orderId') orderId: string, @Body('status') status: string) {
  //   return this.orderService.updateOrderStatus(orderId, status);
  // }

  @Post('user')
  async getOrdersByCustomerId(@Body() body) {
    //completed or processing
    return this.orderService.getOrdersByCustomerId(body.userId, body.state);
  }

  @Post('admin/user')
  async getOrdersByCustomerIdAdmin(@Body() body) {
    //completed or processing
    return this.orderService.getOrdersByCustomerIdAdmin(body.userId, body.state);
  }

  @Get(':orderId')
  async getOrderById(@Param('orderId') orderId: string) {
    return this.orderService.getOrderById(orderId);
  }





}
