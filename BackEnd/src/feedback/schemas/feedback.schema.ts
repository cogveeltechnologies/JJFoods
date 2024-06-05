import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';

export type FeedbackDocument = HydratedDocument<Feedback>;

@Schema()
export class Feedback {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User

  @Prop()
  feedback: string



  @Prop()
  itemId: string;
  // @Prop({ type: Schema.Types.ObjectId, ref: 'User', required: true })
  //   userId: User


  @Prop({ min: 1, max: 5 })
  rating: number;


}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);