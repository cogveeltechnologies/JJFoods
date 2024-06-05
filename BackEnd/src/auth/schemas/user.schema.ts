import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Cart } from 'src/cart/schemas/cart.schema';

export type UserDocument = HydratedDocument<User>;

@Schema(
  {
    timestamps: true

  }
)
export class User {

  // name address email id phoneNumber
  @Prop()
  name: String;



  @Prop({ unique: [true, 'duplicate email entered'] })
  emailId: string;

  @Prop({ unique: [true, 'duplicate number entered'] })
  phoneNumber: number;

  @Prop()
  imageUrl: string;

  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Cart' })
  // cart: Cart

  @Prop({ default: true })
  isActive: boolean

  @Prop()
  reason: string




}

export const UserSchema = SchemaFactory.createForClass(User);