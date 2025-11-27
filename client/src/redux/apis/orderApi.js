// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

// export const orderApi = createApi({
//     reducerPath: "orderApi",
//     baseQuery: fetchBaseQuery({
//         baseUrl: `${import.meta.env.VITE_BACKEND_URL}/user/order`,
//         credentials: "include"
//         // baseUrl: "http://localhost:5000" 
//     }),
//     tagTypes: ["order"],
//     endpoints: (builder) => {
//         return {

//             getOrderByShopId: builder.query({
//                 query: id => {
//                     return {
//                         url: `/shop/${id}`,
//                         method: "GET"
//                     }
//                 },
//                 providesTags: ["order"]
//             }),

//             user: builder.mutation({
//                 query: userData => {
//                     return {
//                         url: "/verify-login-otp",
//                         method: "POST",
//                         body: userData
//                     }
//                 },
//                 invalidatesTags: ["order"]
//             }),

//         }
//     }
// })

// export const { useGetOrderByShopIdQuery } = orderApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const orderApi = createApi({
    reducerPath: "orderApi",
    baseQuery: fetchBaseQuery({
        // baseUrl: ${import.meta.env.VITE_BACKEND_URL}/user/order,
        baseUrl: `https://indian-fast-backend.onrender.com/user/order`,
        credentials: "include"
        // baseUrl: "http://localhost:5000" 
    }),
    tagTypes: ["order"],
    endpoints: (builder) => {
        return {

            getOrderByShopId: builder.query({
                query: (id) => {
                    return {
                        url: `/shop/${id}`,
                        method: "GET"
                    }
                },
                providesTags: ["order"]
            }),

            orderAccepted: builder.mutation({
                query: ({ id, ...userData }) => ({
                    url: `/orderAccepted/${id}`,
                    method: "POST",
                    body: userData,
                }),
                invalidatesTags: ["order"],
            }),

            ConfirmRejectOrder: builder.mutation({
                query: ({ id, ...userData }) => ({
                    url: `/ConfirmRejectOrder/${id}`,
                    method: "PUT",
                    body: userData,
                }),
                invalidatesTags: ["order"],
            }),

        }
    }
})

export const { useGetOrderByShopIdQuery, useOrderAcceptedMutation, useConfirmRejectOrderMutation } = orderApi