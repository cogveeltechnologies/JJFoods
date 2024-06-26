import { Module, forwardRef } from '@nestjs/common';
import { PetPoojaController } from './pet-pooja.controller';
import { PetPoojaService } from './pet-pooja.service';
import { MongooseModule } from '@nestjs/mongoose';
import { WishlistSchema } from 'src/wishlist/schemas/wishlist.schema';
import { WishlistModule } from 'src/wishlist/wishlist.module';
import { FeedbackModule } from 'src/feedback/feedback.module';
import { FeedbackSchema } from 'src/feedback/schemas/feedback.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
  imports: [ConfigModule, MongooseModule.forFeature([{ name: 'Wishlist', schema: WishlistSchema }, { name: 'Feedback', schema: FeedbackSchema }]), forwardRef(() => WishlistModule), forwardRef(() => FeedbackModule)],
  controllers: [PetPoojaController],
  providers: [PetPoojaService],
  exports: [PetPoojaService]
})
export class PetPoojaModule { }
