import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "../Types";


interface CartState {
  cartItems: CartItem[];
}

const initialState: CartState = {
  cartItems: [],
};

const cartItemsSlice = createSlice({
  name: 'cartItems',
  initialState,
  reducers: {
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.cartItems = action.payload;
    },
  }
});

export const { setCartItems } = cartItemsSlice.actions;
export default cartItemsSlice.reducer;
