import { createSlice} from "@reduxjs/toolkit";
export interface INFT {
  name: string;
  description: string;
  traits: string;
  image: string;
}
interface IContract {
  name: string;
  symbol: string;
  owner: string;
  balance: number;
}

const initialState: IContract = { name: "", symbol: "", owner: "", balance: 0 };

const contractInfo = createSlice({
  name: "contractInfo",
  initialState,
  reducers: {
    getInitInfo: (state, action) => {
      state.name = action.payload.name;
      state.symbol = action.payload.symbol;
      state.owner = action.payload.owner;
      state.balance = action.payload.balance;
    },
  },
});
export const { getInitInfo } = contractInfo.actions;
export default contractInfo.reducer;
