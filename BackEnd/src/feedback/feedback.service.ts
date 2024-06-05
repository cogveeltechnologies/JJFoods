import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Feedback } from './schemas/feedback.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from './schemas/review.schema';

@Injectable()
export class FeedbackService {
  constructor(@InjectModel(Feedback.name) private feedbackModel: Model<Feedback>,
    @InjectModel(Review.name) private reviewModel: Model<Review>) {

  }

  async addReview(body) {
    const review = await new this.reviewModel(body);
    await review.save();
    return review;

  }
  async createOrUpdateRating(body) {

    const existingRating = await this.feedbackModel.findOne({ user: body.userId, itemId: body.itemId });
    if (existingRating) {
      //update
      const updatedRating = await this.feedbackModel.findOneAndUpdate({ user: body.userId, itemId: body.itemId }, body, { new: true });

      return updatedRating;
    }
    else {
      //create
      const newRating = new this.feedbackModel(body);
      await newRating.save();
      return newRating;
    }


  }

  async getRating(id) {

    const ratingArray = await this.feedbackModel.find({ itemId: id });
    if (ratingArray.length) {
      const sum = ratingArray.reduce((a, b) => a + b.rating, 0);
      let avg = sum / ratingArray.length;
      return avg;
    }
    return 0;

  }
}
