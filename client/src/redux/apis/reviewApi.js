import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const reviewApi = createApi({
    reducerPath: "reviewApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/user/wishlist`,
        credentials: "include"
    }),
    tagTypes: ["tagName"],
    endpoints: (builder) => {
        return {
            getRatingShop: builder.query({
                query: (shopId) => ({
                    url: `/rating/shop/${shopId}`,
                    method: "GET",
                }),
                providesTags: ["tagName"]
            }),

            addUser: builder.mutation({
                query: (userData) => ({
                    url: "/shop",
                    method: "POST",
                    body: userData
                }),
                invalidatesTags: ["tagName"]
            }),
        }
    }
})

export const { useGetRatingShopQuery, useAddUserMutation } = reviewApi
