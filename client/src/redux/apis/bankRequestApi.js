import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const bankRequestApi = createApi({
    reducerPath: "bankRequestApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/payment`,
        credentials: "include"
    }),
    tagTypes: ["payment"],
    endpoints: (builder) => {
        return {

            getShopBankRequests: builder.query({
                query: (shopId) => {
                    return {
                        url: `/getShopBankRequestsByShopId/${shopId}`,
                        method: "GET"
                    }
                },
                providesTags: ["payment"]
            }),

            bankRequest: builder.mutation({
                query: (data) => ({
                    url: "/ShopBankRequest",
                    method: "POST",
                    body: data,
                }),
                invalidatesTags: ["payment"],
            }),



        }
    }
})

export const { useBankRequestMutation, useGetShopBankRequestsQuery } = bankRequestApi