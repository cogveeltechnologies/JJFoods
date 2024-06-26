import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Wishlist } from './schemas/wishlist.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { PetPoojaService } from 'src/pet-pooja/pet-pooja.service';
import { FeedbackService } from 'src/feedback/feedback.service';
import { CartService } from 'src/cart/cart.service';


@Injectable()
export class WishlistService {
  constructor(@InjectModel(Wishlist.name) private WishlistModel: Model<Wishlist>,
    @Inject(forwardRef(() => PetPoojaService)) private readonly petPoojaService: PetPoojaService, @Inject(forwardRef(() => FeedbackService)) private readonly feedbackService: FeedbackService,
    @Inject(forwardRef(() => CartService)) private readonly cartService: CartService) { }
  async addItem(body) {
    const { userId, itemId } = body;



    const item = await new this.WishlistModel({
      user: userId,
      itemId
    })

    await item.save();

    return await this.petPoojaService.getItemById(itemId, userId)
  }
  async removeItemFromList(body) {
    const { userId, itemId } = body;

    await this.WishlistModel.deleteOne({ user: userId, itemId: itemId });

    return await this.getUserWishlist(userId)
  }

  async addToCart(body) {
    const { userId } = body;
    const { itemId } = body.product;
    await this.cartService.addCart({ ...body, quantity: 1 })

    return await this.removeItemFromList({ userId, itemId })


  }
  async getUserWishlist(userId) {
    const wishlist = await this.WishlistModel.aggregate([

      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: 'items',
          localField: 'itemId',
          foreignField: 'itemid',
          as: 'itemDetails'
        }
      },
      {
        $unwind: '$itemDetails'


      }
    ])
    const wishlistWithRatings = await Promise.all(wishlist.map(async item => {
      const rating = await this.feedbackService.getRating(item.itemId);
      return {
        ...item,
        itemDetails: {
          ...item.itemDetails,
          rating: rating
        }
      };
    }));

    return wishlistWithRatings;


  }

  async removeItem(body) {

    const { userId, itemId } = body;

    await this.WishlistModel.deleteOne({ user: userId, itemId: itemId });

    return await this.petPoojaService.getItemById(itemId, userId)
  }
}
