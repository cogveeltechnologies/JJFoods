import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PetPoojaService } from './pet-pooja.service';

@Controller('petPooja')
export class PetPoojaController {

  constructor(private readonly petPoojaService: PetPoojaService) { }
  @Get('menu')
  fetchMenu() {
    console.log("request")
    return this.petPoojaService.menu()
  }

  @Get('fetchMenu')
  hello() {
    return this.petPoojaService.menu()
  }



  @Post('saveOrder')
  saveOrder(@Body() body) {
    return this.petPoojaService.saveOrder(body)
  }
  @Post('updateData')
  async updateData() {
    try {
      const data = await this.petPoojaService.fetchMenu();
      await this.petPoojaService.updateDatabase(data);
      return "updated";
    } catch (error) {
      throw new Error(error.message)
    }
  }
  @Get('search')
  async search(@Query('q') q) {
    return this.petPoojaService.searchItems(q);
  }

  @Post('/:id')
  async getItemById(@Param('id') id: string, @Body() body) {
    console.log("body", body)
    const response = await this.petPoojaService.getItemById(id, body.userId)

    console.log(response)
    return response;

  }
}
