import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Get('admin/orders/:state')
  async getAdminOrdersByState(@Param('state') state) {
    console.log(state)
    const res = await this.orderService.getAdminOrdersByState(state)
    return res

  }
  @Get('admin/getAllOrders')
  async getAllOrders() {
    return this.orderService.getAllOrders()
  }


  @Get('admin/details')
  async getDetails() {
    console.log("called")
    const details = await this.orderService.getDetails();
    // console.log(details)
    return details

  }
  @Get('admin/getOrders/:period')
  async getOrdersByPeriod(@Param('period') period: 'today' | 'week' | 'month') {
    console.log(period)
    const res = await this.orderService.findOrdersByTimePeriod(period);
    console.log(res)
    return res
  }

  @Post('/createOrder')
  async createOrder(@Body() body) {
    console.log("order body:---------------------------", body)
    return this.orderService.createOrder(body);
  }

  @Put('state/:orderId')
  async updateOrderState(@Param('orderId') orderId: string, @Body() state: string) {
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

  @Post('/user/order')
  async getOrderByCustomerId(@Body() body) {

    console.log("---------------------------", body)
    return this.orderService.getOrderByCustomerId(body.userId, body.orderId)
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
