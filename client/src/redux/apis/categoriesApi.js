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
                async onQueryStarted(formData, { dispatch, queryFulfilled }) {
                    try {
                        const { data: newCategory } = await queryFulfilled;
                        dispatch(
                            categoriesApi.util.updateQueryData('getAllCategories', undefined, (draft) => {
                                if (newCategory) {
                                    draft.push(newCategory);
                                }
                            })
                        );
                    } catch { }
                }
            }),
            addProduct: builder.mutation({
                query: (formData) => ({
                    url: "/addproduct",
                    method: "POST",
                    body: formData,
                }),
                invalidatesTags: ["categories"],
                async onQueryStarted(formData, { dispatch, queryFulfilled }) {
                    try {
                        const { data: newProduct } = await queryFulfilled;
                        // Assuming the backend returns the created product or the updated category
                        // If it returns the product, we need to know which category it belongs to.
                        // The formData contains 'category_name'.
                        // Note: formData is a FormData object, so we need to get the value.
                        const categoryName = formData.get('category_name');

                        if (newProduct && categoryName) {
                            dispatch(
                                categoriesApi.util.updateQueryData('getAllCategories', undefined, (draft) => {
                                    const category = draft.find(c => c.category_name === categoryName);
                                    if (category) {
                                        category.products.push(newProduct);
                                    }
                                })
                            );
                        }
                    } catch { }
                }
            }),
            deleteProduct: builder.mutation({
                query: (id) => ({
                    url: `/delete/product/${id}`,
                    method: "DELETE",
                }),
                invalidatesTags: ["categories"],
                async onQueryStarted(id, { dispatch, queryFulfilled }) {
                    const patchResult = dispatch(
                        categoriesApi.util.updateQueryData('getAllCategories', undefined, (draft) => {
                            draft.forEach(cat => {
                                cat.products = cat.products.filter(p => p._id !== id);
                            });
                        })
                    );
                    try {
                        await queryFulfilled;
                    } catch {
                        patchResult.undo();
                    }
                }
            }),
            editProduct: builder.mutation({
                query: ({ id, formData }) => ({
                    url: `/edit/product/${id}`,
                    method: "PATCH",
                    body: formData,
                }),
                invalidatesTags: ["categories"],
            }),
            // /vendor/categories/update/:id
            editCategories: builder.mutation({
                query: ({ id, formData }) => ({
                    url: `/update/${id}`,
                    method: "PUT",
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
                async onQueryStarted(id, { dispatch, queryFulfilled }) {
                    const patchResult = dispatch(
                        categoriesApi.util.updateQueryData('getAllCategories', undefined, (draft) => {
                            return draft.filter(c => c._id !== id);
                        })
                    );
                    try {
                        await queryFulfilled;
                    } catch {
                        patchResult.undo();
                    }
                }
            }),

            productToggle: builder.mutation({
                query: (productId) => ({
                    url: `/toggle/${productId}`,  // 
                    method: "PATCH",
                }),
                async onQueryStarted(productId, { dispatch, queryFulfilled }) {

                    const patchResult = dispatch(
                        categoriesApi.util.updateQueryData('getAllCategories', undefined, (draft) => {
                            draft.forEach(cat => {
                                const product = cat.products.find(p => p._id === productId);
                                if (product) {
                                    const isAvailable = product.available === true || product.available === "Available";
                                    product.available = !isAvailable;
                                }
                            });
                        })
                    );

                    try {
                        await queryFulfilled;
                    } catch {
                        patchResult.undo();
                    }
                }
            }),

        }
    }
})

export const { useCategoriesAddMutation, useGetAllCategoriesQuery, useAddProductMutation, useProductToggleMutation,
    useDeleteProductMutation, useDeleteCategoryMutation, useEditProductMutation, useEditCategoriesMutation } = categoriesApi
