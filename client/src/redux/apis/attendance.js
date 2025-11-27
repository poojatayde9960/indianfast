import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const attendanceApi = createApi({
    reducerPath: "attendanceApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/vendor/Attendance`,
        credentials: "include"
    }),
    tagTypes: ["order"],
    endpoints: (builder) => {
        return {

            user: builder.query({
                query: () => {
                    return {
                        url: `user`,
                        method: "GET"
                    }
                },
                providesTags: ["order"]
            }),

            toggleAvailability: builder.mutation({
                query: (data) => ({
                    url: "/toggle-availability",
                    method: "POST",
                    body: {
                        ShopId: data.ShopId,
                    },
                }),
                invalidatesTags: ["order"],
            }),



        }
    }
})

export const { useToggleAvailabilityMutation } = attendanceApi