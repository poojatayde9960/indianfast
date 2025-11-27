import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const categoriesApi = createApi({
    reducerPath: "categoriesApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/vendor/categories`,
        credentials: "include"
    }),
    tagTypes: ["categories"],
    endpoints: (builder) => {
        return {

            getAllCategories: builder.query({
                query: () => {
                    return {
                        url: "/getAll",
                        method: "GET"
                    }
                },
                providesTags: ["categories"]
            }),

            categoriesAdd: builder.mutation({
                query: (formData) => ({
                    url: "/add",
                    method: "POST",
                    body: formData,
                }),
                invalidatesTags: ["categories"],
            }),
            addProduct: builder.mutation({
                query: (formData) => ({
                    url: "/addproduct",
                    method: "POST",
                    body: formData,
                }),
                invalidatesTags: ["categories"],
            }),
            deleteProduct: builder.mutation({
                query: (id) => ({
                    url: `/delete/product/${id}`,
                    method: "DELETE",
                }),
                invalidatesTags: ["categories"],
            }),
            editProduct: builder.mutation({
                query: ({ id, formData }) => ({
                    url: `/edit/product/${id}`,
                    method: "PATCH",
                    body: formData,
                }),
                invalidatesTags: ["categories"],
            }),


            deleteCategory: builder.mutation({
                query: (id) => ({
                    url: `/delete/${id}`,
                    method: "DELETE",
                }),
                invalidatesTags: ["categories"],
            }),

            productToggle: builder.mutation({
                query: (productId) => ({
                    url: `/toggle/${productId}`,  // dynamic product id
                    method: "PATCH",
                }),
                async onQueryStarted(productId, { dispatch, queryFulfilled }) {
                    // Optimistic toggle
                    const patchResult = dispatch(
                        categoriesApi.util.updateQueryData('getAllCategories', undefined, (draft) => {
                            draft.forEach(cat => {
                                const product = cat.products.find(p => p._id === productId);
                                if (product) {
                                    product.available = !product.available;  // real toggle in cache
                                }
                            });
                        })
                    );

                    try {
                        await queryFulfilled;
                    } catch {
                        patchResult.undo(); // error आला तर revert
                    }
                }
            }),

        }
    }
})

export const { useCategoriesAddMutation, useGetAllCategoriesQuery, useAddProductMutation, useProductToggleMutation,
    useDeleteProductMutation, useDeleteCategoryMutation, useEditProductMutation } = categoriesApi
