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
            getShopStatus: builder.query({
                query: (shopId) => ({
                    url: `getShoplastStatus/${shopId}`,
                    method: "GET",
                }),
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

            getToggleAvailability: builder.mutation({
                query: (data) => ({
                    url: "/get/toggle-availability",
                    method: "POST",
                    body: {
                        ShopId: data.ShopId,
                        date: data.date,
                    },
                }),
                invalidatesTags: ["order"],
            }),
            attendanceGetDashbord: builder.mutation({
                query: (data) => ({
                    url: "/get/dashbord",
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

export const { useToggleAvailabilityMutation,
    useGetShopStatusQuery, useGetToggleAvailabilityMutation, useAttendanceGetDashbordMutation, useGetDashboardQuery } = attendanceApi