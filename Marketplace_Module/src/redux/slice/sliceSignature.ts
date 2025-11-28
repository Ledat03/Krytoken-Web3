import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Verify } from "@/service/MainService";
import { SignMessage } from "@/service/MainService";
interface UserInfo {
  address: string;
  nonce: number;
  isLoading: boolean;
  isError: boolean;
  isAddressValid: boolean;
}
const initialState: UserInfo = { address: "", nonce: 0, isLoading: false, isError: false, isAddressValid: false };
export const fetchInfoUser = createAsyncThunk("user/fetchInfoUser", async (address: string) => {
  const res = await Verify(address);
  console.log("res data : ", res);
  return res.data;
});

export const checkSignature = createAsyncThunk("user/checkSignature", async (Info: object) => {
  const res = await SignMessage(Info);
  if (res.status == 200) {
    localStorage.setItem("accessToken", res.data.accessToken);
  }
  console.log(res);
  return res.data;
});
const addressUser = createSlice({
  name: "IdentifyAddress",
  initialState,
  reducers: {
    storeInfo: (state, action) => {
      (state.address = action.payload.address), (state.nonce = action.payload.nonce);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchInfoUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchInfoUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.address = action.payload.address;
        state.nonce = action.payload.nonce;
        state.isError = false;
        state.isAddressValid = action.payload.verified;
      })
      .addCase(fetchInfoUser.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(checkSignature.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(checkSignature.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAddressValid = action.payload.verified;
        state.isError = false;
      })
      .addCase(checkSignature.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});
export const { storeInfo } = addressUser.actions;
export default addressUser.reducer;
