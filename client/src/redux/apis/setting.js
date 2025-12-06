
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const settingsApi = createApi({
    reducerPath: "settingsApi",
    baseQuery: fetchBaseQuery({
        // baseUrl: ${import.meta.env.VITE_BACKEND_URL}/user/order,
        baseUrl: `https://indian-fast-backend.onrender.com/admin`,
        credentials: "include"
        // baseUrl: "http://localhost:5000" 
    }),
    tagTypes: ["settings"],
    endpoints: (builder) => {
        return {

            registretionFess: builder.query({
                query: (id) => {
                    return {
                        url: "/settings/get",
                        method: "GET"
                    }
                },
                providesTags: ["settings"]
            }),



        }
    }
})

export const { useRegistretionFessQuery, } = settingsApi