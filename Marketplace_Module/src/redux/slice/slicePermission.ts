import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { updatePermission, getPermission } from "@/service/MainService";
export interface Permission {
  address: string;
  tokenAlowance: number;
  nftAlowanceAll: boolean;
}

export interface PermissionState {
  data: Permission | null;
  loading: boolean;
  error: string | null;
}
const initialState: PermissionState = {
  data: null,
  loading: false,
  error: null,
};
export const savePermission = createAsyncThunk("/save/permission", async (permission: Permission) => {
  if (permission == null) {
    console.log("first")
    return;
  }
  try {
    const response = await updatePermission(permission);
    console.log(response);
    return response.data;
  } catch (error) {
    throw error;
  }
});
export const fetchPermission = createAsyncThunk("/fetch/permission", async (address: string) => {
  if (!address) {
    return;
  }
  try {
    const response = await getPermission(address);
    console.log(response);
    return response.data;
  } catch (error) {
    throw error;
  }
});
const StatePermission = createSlice({
  name: "Permission",
  initialState,
  reducers: {
    fillPermission: (state, action) => {
      if (action) {
        state.data = action.payload.data;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(savePermission.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(savePermission.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(savePermission.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to save permission";
    });
    builder.addCase(fetchPermission.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchPermission.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(fetchPermission.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch permission";
    });
  },
});
export const { fillPermission } = StatePermission.actions;
export default StatePermission.reducer;
