import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { WishlistService } from './wishlist.service';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) { }

  @Post('add')
  addItem(@Body() body) {
    console.log(body)

    return this.wishlistService.addItem(body)
  }

  @Get('/:userId')
  getUserWishlist(@Param('userId') userId) {
    return this.wishlistService.getUserWishlist(userId)
  }

  @Post('remove')
  removeItem(@Body() body) {

    return this.wishlistService.removeItem(body)
  }

  @Post('remove/item')
  removeItemFromList(@Body() body) {

    return this.wishlistService.removeItemFromList(body)
  }
  @Post('addToCart')
  async addToCart(@Body() body) {
    console.log("add to cart from wishlist")

    const response = await this.wishlistService.addToCart(body)
    console.log(response)
    return response;
  }

}
