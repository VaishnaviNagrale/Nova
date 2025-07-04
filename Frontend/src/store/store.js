import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js"
import searchReducer from "./searchSlice.js";

const store = configureStore({
    reducer: {
        auth : authReducer,
        search: searchReducer,
    }
})
export default store;