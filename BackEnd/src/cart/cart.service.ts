import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Connection, Model } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';
import { Cart } from './schemas/cart.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Cart.name) private cartModel: Model<Cart>
  ) { }
  async bulkAddCart(body) {
    const { userId, products } = body;

    // Find the cart for the user
    let cart = await this.cartModel.findOne({ user: userId });

    if (!cart) {
      // Create a new cart if it doesn't exist
      cart = new this.cartModel({
        user: userId,
        cartItems: [],
      });
    }

    for (const product of products) {
      const { itemId, quantity } = product;

      // Find the index of the product in the cart if it exists
      const productIndex = cart.cartItems.findIndex(
        (item) => item.product.itemId == itemId
      );

      if (productIndex !== -1) {
        // Update the quantity of the existing product
        cart.cartItems[productIndex].quantity += quantity;
      } else {
        // Add the new product to the cart
        cart.cartItems.push({
          user: userId,
          product: { itemId },
          quantity,
        });
      }
    }

    // Save the updated cart
    await cart.save();

    // Return the updated cart
    return await this.getUserCart(userId, undefined);
  }

  async addCart(body) {
    // console.log(body)
    const { userId } = body;
    const { itemId } = body.product;
    const { quantity } = body
    console.log(quantity)
    const cart = await this.cartModel.findOne({ user: userId });
    if (cart) {
      const productExist = cart.cartItems.findIndex(
        (item) => item.product.itemId == itemId
      );
      if (productExist !== -1) {
        await this.cartModel.findOneAndUpdate(
          { user: userId, "cartItems.product.itemId": itemId },
          { $inc: { "cartItems.$.quantity": quantity } },
          { new: true }
        );
        const updatedProduct = await this.cartModel.findOne({ user: userId });


        return await this.getUserCart(userId, undefined)
      } else {
        const addNewProduct = await this.cartModel.findOneAndUpdate(
          { user: userId },
          { $push: { cartItems: { product: { ...body.product }, quantity } } },
          { new: true }
        );

        return await this.getUserCart(userId, undefined)
      }
    } else {
      const product = await this.cartModel.create({
        user: userId,
        cartItems: [{ product: { ...body.product }, quantity }],
      });
      // return await this.getUserCart(userId, undefined)
      return await this.getUserCart(userId, undefined)
    }
  };

  async getUserCart(userId, body) {
    // console.log("req", userId, body.discount)
    let discount = 0;
    let deliveryFee = 0;
    if (body?.discount) {
      discount = body?.discount
    }

    if (body?.deliveryFee) {
      deliveryFee = body?.deliveryFee
    }


    const cart = await this.cartModel.findOne({ user: userId });
    // console.log(cart)
    if (!cart) {
      // throw new Error('Cart not found');


      return {
        itemsTotal: 0,
        cgst: 0,
        sgst: 0,
        discount: 0,
        deliveryFee: 0,
        grandTotal: 0
      }
    }

    // Create a map of itemId to quantity
    const itemIdToQuantityMap = cart.cartItems.reduce((map, item) => {
      map[item.product.itemId] = item.quantity;
      return map;
    }, {});

    const itemIds = cart.cartItems.map(item => item.product.itemId);
    const items = await this.connection.db.collection('items').find({ itemid: { $in: itemIds } }).toArray();

    // Add the correct quantity to each item
    const newData = items.map(item => ({
      ...item,
      quantity: itemIdToQuantityMap[item.itemid],
      totalCost: itemIdToQuantityMap[item.itemid] * item.price,
    }));

    const itemsTotal = newData.reduce((total, item) => {
      return total + item.totalCost
    }, 0)

    const taxes = await this.connection.db.collection('taxes').find().toArray();
    const cgst = taxes[0].tax * itemsTotal / 100;
    const sgst = taxes[1].tax * itemsTotal / 100;


    const platformFee = 15;

    const grandTotal = itemsTotal + cgst + sgst + platformFee - discount + deliveryFee;

    const cartLength = await this.getCartNumber(userId)



    // console.log(newData);
    return { newData, itemsTotal, cgst, sgst, platformFee, grandTotal, discount, deliveryFee, cartLength };
  }

  // async getCartNumber(body) {
  //   const { userId } = body;
  //   // console.log(userId);
  //   const resPonse = await this.cartModel.findOne({ user: userId });
  //   console.log(resPonse)
  //   if (resPonse) {
  //     return resPonse.cartItems.length
  //   }
  //   else {
  //     return 0;

  //   }
  // }
  async getCartNumber(userId) {

    const response = await this.cartModel.findOne({ user: userId });

    if (response) {
      const totalQuantity = response.cartItems.reduce((total, item) => total + item.quantity, 0);
      return totalQuantity;
    } else {
      return 0;
    }
  }

  async removeCartItem(body) {
    const { userId } = body;
    const { itemId } = body.product;
    const cart = await this.cartModel.findOne({
      user: userId,
      "cartItems.product.itemId": itemId,
    });
    if (cart) {
      const response = await this.cartModel.findOneAndUpdate(
        {
          user: userId,
          "cartItems.product.itemId": itemId,
        },
        { $pull: { cartItems: { "product.itemId": itemId } } },
        { new: true }
      );
      return ({
        message: "Item removed from cart",
        total: response?.cartItems?.length,
      });
    } else {

      throw new Error("item not found");
    }
  };

  async removeCart(body) {
    const { userId } = body;
    const response = await this.cartModel.findOneAndDelete({ user: userId });
    return response
  }

  async addQuantity(body) {
    const { userId } = body;
    const { itemId } = body.product;
    const cart = await this.cartModel.findOne({
      user: userId,
      "cartItems.product.itemId": itemId,
    });
    if (cart) {
      await this.cartModel.findOneAndUpdate(
        { "cartItems.product.itemId": itemId },
        { $inc: { "cartItems.$.quantity": 1 } },
        { new: true }
      );
      return await this.getUserCart(userId, undefined)
      // return ({ message: "Added qty" });
    } else {

      throw new Error("Item not found");
    }
  }
  async decreaseQuantity(body) {
    const { userId } = body;
    const { itemId } = body.product;
    const cart = await this.cartModel.findOne({
      user: userId,
      "cartItems.product.itemId": itemId,
    });
    if (cart) {
      let element = cart.cartItems.find(item => item.product.itemId === itemId);
      console.log(element)

      if (element) {
        if (element.quantity <= 1) {
          // Remove the item from the cart
          await this.cartModel.updateOne(
            { user: userId },
            { $pull: { cartItems: { "product.itemId": itemId } } }
          );

          // return { message: "Item removed from cart" };
          return await this.getUserCart(userId, undefined)
        }
        await this.cartModel.findOneAndUpdate(
          { "cartItems.product.itemId": itemId },
          { $inc: { "cartItems.$.quantity": -1 } },
          { new: true }
        );
        // return ({ message: "Decreased qty" });
        return await this.getUserCart(userId, undefined)
      } else {

        throw new Error("Item not found");
      }
    };
  }
}
