import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const vendorApi = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/vendor/auth`,
        credentials: "include"
        // baseUrl: "http://localhost:5000" 
    }),
    tagTypes: ["vendor"],
    endpoints: (builder) => {
        return {
            getProfile: builder.query({
                query: (shopId) => ({
                    url: `/get/${shopId}`,
                    method: "GET",
                }),
                providesTags: ["vendor"],
            }),
            // vendorLogin: builder.mutation({
            //     query: userData => {
            //         return {
            //             url: "/login",
            //             method: "POST",
            //             body: userData
            //         }
            //     },
            //     transformResponse: data => {
            //         localStorage.setItem("shopId", JSON.stringify(data.result || {}));

            //         // localStorage.setItem("shopId", JSON.stringify(data.result))
            //         return data.result
            //     },
            //     invalidatesTags: ["vendor"]
            // }),
            vendorLogin: builder.mutation({
                query: (userData) => ({
                    url: "/login",
                    method: "POST",
                    body: userData,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }),
                transformResponse: (data) => {
                    const shopId = data?.shopId || data?.result?.shopId;
                    if (shopId) {
                        localStorage.setItem("shopId", JSON.stringify({ shopId }));
                    }
                    return data;
                },

                invalidatesTags: ["vendor"],
            }),

            vendorRegister: builder.mutation({
                query: (formData) => ({
                    url: "/register",
                    method: "POST",
                    body: formData,
                }),
                transformResponse: (data) => data.result,
                invalidatesTags: ["vendor"],
            }),
            revenueShop: builder.mutation({
                query: (formData) => ({
                    url: "/shop/revenue",
                    method: "POST",
                    body: formData,
                }),
                // transformResponse: (data) => data.result,
                invalidatesTags: ["vendor"],
            }),

            verifyLoginOtp: builder.mutation({
                query: (userData) => ({
                    url: "/verify-login-otp",
                    method: "POST",
                    body: userData,
                }),
                transformResponse: (data) => {
                    if (data?.result) {
                        localStorage.setItem("adminInfo", JSON.stringify(data.result));
                    }
                    return data.result;
                },
                invalidatesTags: ["vendor"],
            }),
            vendorLogout: builder.mutation({
                query: (shopId) => ({
                    url: `/logout/${shopId}`,
                    method: "POST",
                }),
                invalidatesTags: ["vendor"],
            }),


        }
    }
})

export const { useRevenueShopMutation, useVendorLoginMutation, useVerifyLoginOtpMutation, useVendorRegisterMutation, useGetProfileQuery, useVendorLogoutMutation } = vendorApi
