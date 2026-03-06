import { createSlice } from "@reduxjs/toolkit";

const token = localStorage.getItem("accessToken");

const initialState = {
    status: !!token,
    userData : null,
    token: token || null,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            const { user, accessToken } = action.payload.data;

            state.status = true;
            state.userData = user;
            state.token = accessToken;

            localStorage.setItem("accessToken", accessToken);
        },
        logout: (state) => {
            state.status = false;
            state.userData = null;
            state.token = null;

            localStorage.removeItem("accessToken");
        },
    }
})



export const { login, logout } = authSlice.actions;
export default authSlice.reducer;