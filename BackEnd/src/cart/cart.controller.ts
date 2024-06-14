import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {

  }
  @Post('add')
  async addCart(@Body() body: any) {
    // console.log("request", body)




    const cart = await this.cartService.addCart(body);
    // console.log("response", cart)

    return cart;
  }
  @Get('/:userId')
  async getUserCart(@Param('userId') userId, @Body() body) {
    // console.log("param", userId)

    const cart = await this.cartService.getUserCart(userId, body);
    // console.log("response", cart)
    return cart;
  }
  @Get('cartNumber/:userId')
  async getCartNumber(@Param('userId') userId: any) {

    const cartNumber = await this.cartService.getCartNumber(userId);
    return cartNumber;
  }

  @Post('removeItem')
  async removeCartItem(@Body() body: any) {

    const cart = await this.cartService.removeCartItem(body);
    return cart;
  }

  @Post('remove')
  async removeCart(@Body() body) {
    const cart = await this.cartService.removeCart(body)
  }

  @Put('addQuantity')
  async addQuantity(@Body() body: any) {


    const cart = await this.cartService.addQuantity(body);

    return cart;
  }

  @Put('decreaseQuantity')
  async decreaseQuantity(@Body() body: any) {
    console.log("request", body)

    const cart = await this.cartService.decreaseQuantity(body);
    console.log("response", cart)
    return cart;
  }
}
