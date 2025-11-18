import { createSlice } from "@reduxjs/toolkit";

interface IOrderCancel {
  orderId: number;
  blockTimestamp: number;
}
export interface IListOrderCancel {
  orderCancels: IOrderCancel[];
}

const initialState: IListOrderCancel = { orderCancels: [] };

const orderCancel = createSlice({
  name: "ListOrderCancel",
  initialState,
  reducers: {
    fillListCancel: (state, action) => {
      state.orderCancels = action.payload.orderAddeds;
    },
  },
});
export const { fillListCancel } = orderCancel.actions;
export default orderCancel.reducer;
