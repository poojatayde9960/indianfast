import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const offerApi = createApi({
    reducerPath: "offerApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/vendor/offer`,
        credentials: "include"
    }),
    tagTypes: ["offer"],
    endpoints: (builder) => {
        return {

            getBanner: builder.query({
                query: (shopId) => ({
                    url: `/getby/${shopId}`,
                    method: "GET",
                }),
                providesTags: ["offer"],
            }),


            addOffer: builder.mutation({
                query: (formData) => ({
                    url: "/add",
                    method: "POST",
                    body: formData,
                }),
                invalidatesTags: ["offer"],
            }),
            deleteCategory: builder.mutation({
                query: (id) => ({
                    url: `/delete/${id}`,
                    method: "DELETE",
                }),
                invalidatesTags: ["offer"],
            }),


        }
    }
})

export const { useAddOfferMutation, useGetBannerQuery } = offerApi

