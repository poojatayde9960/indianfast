import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const offerApi = createApi({
    reducerPath: "offerApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/vendor/offer`,
        credentials: "include"
    }),
    tagTypes: ["order"],
    endpoints: (builder) => {
        return {

            getBanner: builder.query({
                query: (shopId) => ({
                    url: `/getby/${shopId}`,
                    method: "GET",
                }),
                providesTags: ["order"],
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
                invalidatesTags: ["categories"],
            }),


        }
    }
})

export const { useAddOfferMutation, useGetBannerQuery } = offerApi

