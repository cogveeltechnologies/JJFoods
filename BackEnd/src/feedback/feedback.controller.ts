import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FeedbackService } from './feedback.service';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {


  }

  @Post('/orderItemRating')
  async createOrderItemRating(@Body() body) {
    // console.log("feedback create", body)

    return this.feedbackService.createOrderItemRating(body)
  }

  @Post('/getOrderItemRating')
  async getOrderItemRating(@Body() body) {

    return this.feedbackService.getOrderItemRating(body)
  }
  @Get('/:id')
  getRating(@Param('id') id) {

    return this.feedbackService.getRating(id)


  }
  @Post()
  createRating(@Body() body) {

    return this.feedbackService.createOrUpdateRating(body)


  }
  @Post('/review')
  async addReview(@Body() body) {

    const review = await this.feedbackService.addReview(body);
    return review

  }
}
