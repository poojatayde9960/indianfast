// import { createSlice } from "@reduxjs/toolkit";
// import { vendorApi } from "../apis/vendorApi";

// const vendorSlice = createSlice({
//     name: "vendorSlice",
//     initialState: {
//         shopId: JSON.parse(localStorage.getItem("shopId")),
//     },
//     reducers: {
//         logout: (state) => {
//             state.shopId = null;
//         },
//     },
//     extraReducers: builder => builder
//         .addMatcher(vendorApi.endpoints.vendorLogin.matchFulfilled, (state, { payload }) => {
//             state.shopId = payload;
//         })


// })

// export const { logout } = vendorSlice.actions
// export default vendorSlice.reducer

// src/redux/slices/vendorSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { vendorApi } from "../apis/vendorApi";

const vendorSlice = createSlice({
    name: "vendor",
    initialState: {
        shopId: null,
        isActive: false,        // Online / Offline status
        checkInTime: null,      // Check-in time
    },
    reducers: {
        logout: (state) => {
            state.shopId = null;
            state.isActive = false;
            state.checkInTime = null;
        },
        setActive: (state, action) => {
            state.isActive = action.payload;
        },
        setCheckInTime: (state, action) => {
            state.checkInTime = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            vendorApi.endpoints.vendorLogin.matchFulfilled,
            (state, { payload }) => {
                state.shopId = payload?.shopId || payload?.result?.shopId || null;
            }
        );
    },
});

export const { logout, setActive, setCheckInTime } = vendorSlice.actions;
export default vendorSlice.reducer;

