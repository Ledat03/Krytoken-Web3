import { createSlice } from "@reduxjs/toolkit";

interface IOrderAdded {
  tokenTransfer: string;
  tokenId: number;
  price: BigInt;
  orderId: number;
  blockTimestamp: number;
  isMatched:boolean
}
export interface IListOrderAdded {
  orderAddeds: IOrderAdded[];
}

const initialState: IListOrderAdded = { orderAddeds: [] };

const orderAdded = createSlice({
  name: "ListOrderAdded",
  initialState,
  reducers: {
    fillListOrder: (state, action) => {
        
      state.orderAddeds = action.payload?.orderAddeds;
    },
  },
});
export const { fillListOrder } = orderAdded.actions;
export default orderAdded.reducer;
