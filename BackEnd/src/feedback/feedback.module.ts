import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { UserSchema } from 'src/auth/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { FeedbackSchema } from './schemas/feedback.schema';
import { ReviewSchema } from './schemas/review.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }, {
    name: 'Feedback', schema: FeedbackSchema
  }, {
    name: 'Review', schema: ReviewSchema
  }])],
  providers: [FeedbackService],
  controllers: [FeedbackController],
  exports: [FeedbackService]
})
export class FeedbackModule { }
