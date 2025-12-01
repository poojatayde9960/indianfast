// import { configureStore } from "@reduxjs/toolkit";
// import { vendorApi } from "./apis/vendorApi";
// import vendorSlice from './slices/vendorSlice'
// import { orderApi } from "./apis/orderApi";

// const reduxStore = configureStore({
//     reducer: {
//         [vendorApi.reducerPath]: vendorApi.reducer,
//         [orderApi.reducerPath]: orderApi.reducer,
//         auth: vendorSlice,
//     },
//     middleware: (getDefaultMiddleware) =>
//         getDefaultMiddleware().concat(vendorApi.middleware, orderApi.middleware),
// });

// export default reduxStore;






import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage 
import { vendorApi } from "./apis/vendorApi";
import { orderApi } from "./apis/orderApi";
import vendorSlice from "./slices/vendorSlice";
import { attendanceApi } from "./apis/attendance.js";
import { categoriesApi } from "./apis/categoriesApi";
import { offerApi } from "./apis/offerApi";
import { reviewApi } from "./apis/reviewApi";
import { bankRequestApi } from "./apis/bankRequestApi.js";


const rootReducer = combineReducers({
    auth: vendorSlice,
    [offerApi.reducerPath]: offerApi.reducer,
    [vendorApi.reducerPath]: vendorApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [attendanceApi.reducerPath]: attendanceApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
    [bankRequestApi.reducerPath]: bankRequestApi.reducer,
});

// 🔹 persist config
const persistConfig = {
    key: "root",
    storage,
    whitelist: ["auth"],
};


const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(vendorApi.middleware,
            orderApi.middleware,
            attendanceApi.middleware,
            offerApi.middleware,
            categoriesApi.middleware,
            reviewApi.middleware,
            bankRequestApi.middleware),
});

export const persistor = persistStore(store);
