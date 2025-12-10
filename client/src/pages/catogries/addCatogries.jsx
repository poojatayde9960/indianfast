import React, { useState } from "react";
import edit from "/edit.png";
import deleteIcon from "/delete.png";
import { useDeleteCategoryMutation, useEditCategoriesMutation, useGetAllCategoriesQuery } from "../../redux/apis/categoriesApi";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react";
import { useForm } from "react-hook-form";
const AddCategories = ({ searchTerm }) => {
    const [editCategories] = useEditCategoriesMutation()
    const { data, isLoading } = useGetAllCategoriesQuery(undefined, { refetchOnMountOrArgChange: true });
    const [deleteCategory] = useDeleteCategoryMutation()
    const [showModal, setShowModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryName, setCategoryName] = useState("");
    const [editImageFile, setEditImageFile] = useState(null);

    const {
        register: registerEdit,
        handleSubmit: handleSubmitEdit,
        formState: { errors: editErrors },
        reset: resetEdit,
        setValue
    } = useForm();

    console.log("API DATA → ", data);
    const handleDelete = async (id) => {
        try {
            await deleteCategory(id).unwrap();
            // alert("Deleted successfully");
            toast.error("Deleted successfully!!!");
        } catch (error) {
            console.error("Delete failed:", error);
            alert(error?.data?.message || "Failed to delete product");
        }
    };
    const categories = Array.isArray(data) ? data : [];

    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl mt-8 shadow-md p-6 w-full mb-6 animate-pulse">

                <div className="h-6 w-40 bg-slate-300 rounded mb-5"></div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[400px]">
                        <thead className="bg-gray-100">
                            <tr className="h-14">
                                <th className="py-2 px-5">
                                    <div className="h-3 w-10 bg-slate-300 rounded"></div>
                                </th>
                                <th className="py-2 px-5">
                                    <div className="h-3 w-28 bg-slate-300 rounded"></div>
                                </th>
                                <th className="py-2 px-5">
                                    <div className="h-3 w-20 bg-slate-300 rounded"></div>
                                </th>
                                <th className="py-2 px-5 text-right">
                                    <div className="h-3 w-16 bg-slate-300 rounded ml-auto"></div>
                                </th>
                            </tr>
                        </thead>
                    </table>

                    <div className="h-[550px] scrollbar-hide">
                        <table className="w-full border-collapse">
                            <tbody>
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <tr
                                        key={i}
                                        className="border-t h-16 hover:bg-gray-50 transition-colors"
                                    >
                                        {/* Sr no */}
                                        <td className="py-2 px-11">
                                            <div className="h-3 w-6 bg-slate-300 rounded"></div>
                                        </td>

                                        {/* Category name */}
                                        <td className="py-2 px-6">
                                            <div className="h-3 w-40 bg-slate-300 rounded"></div>
                                        </td>

                                        {/* Category image */}
                                        <td className="py-2 px-6">
                                            <div className="w-12 h-12 bg-slate-300 rounded-md"></div>
                                        </td>

                                        {/* Action icons */}
                                        <td className="py-2 px-6 text-right">
                                            <div className="flex justify-end gap-4">
                                                <div className="w-5 h-5 bg-slate-300 rounded"></div>
                                                <div className="w-5 h-5 bg-slate-300 rounded"></div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        );
    }


    const filteredCategories = categories.filter(cat => {
        const categoryMatch = cat.category_name
            ?.toLowerCase()
            ?.includes(searchTerm?.toLowerCase() || "");

        const productMatch = cat.products?.some(p =>
            p.name?.toLowerCase()?.includes(searchTerm?.toLowerCase() || "")
        );

        return categoryMatch || productMatch;
    });
    const handleEdit = (cat) => {
        setSelectedCategory(cat);
        setValue("name", cat.category_name);
        setEditImageFile(null);
        setShowModal(true);
    };
    const onSubmitEdit = async (formData) => {
        try {
            const payload = new FormData();
            payload.append("category_name", formData.name.trim());

            if (editImageFile) {
                payload.append("image", editImageFile);
            }

            await editCategories({
                id: selectedCategory._id,
                formData: payload
            }).unwrap();

            toast.success("Category updated successfully!");
            setShowModal(false);
            setSelectedCategory(null);
            setEditImageFile(null);
            resetEdit();

        } catch (err) {
            toast.error(err?.data?.message || "Update failed");
        }
    };
    return (
        <>
            {/* <pre className="text-black">{JSON.stringify(data, null, 2)}</pre> */}
            <div>
                <h2 className="text-lg font-semibold  text-gray-800">All Categories</h2>
                <div className="bg-white rounded-2xl mt-8 shadow-md  p-6 w-full mb-6">
                    <div className="w-full h-[90%]">

                        <div className="overflow-x-auto  hidden md:block">
                            <table className="w-full border-collapse text-left text-gray-800 min-w-[400px]">
                                <thead className="bg-gray-100 text-[100%] font-DM Sans">
                                    <tr className="h-14 dm-sans font-bold">
                                        <th className="py-2 px-5">Sr.no</th>
                                        <th className="py-2">Category Name</th>
                                        <th className="py-2">Image</th>
                                        <th className="py-2 px-6 text-right">Action</th>
                                    </tr>
                                </thead>
                            </table>

                            <div className="h-[350px]  overflow-y-auto scrollbar-hide">

                                <table className="w-full border-collapse text-left text-gray-800 min-w-[400px]">
                                    <tbody className="text-sm">

                                        {filteredCategories.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="py-10">
                                                    <div className="flex flex-col items-center justify-center animate-fadeIn">
                                                        <img
                                                            src="https://cdn-icons-png.flaticon.com/512/7465/7465705.png"
                                                            alt="No data"
                                                            className="w-32 h-32 opacity-90 mb-3"
                                                        />
                                                        <h2 className="text-lg font-semibold text-gray-700">No Categories Found</h2>
                                                        <p className="text-gray-500 mt-1 text-sm">Try adding a new category or change your search.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredCategories.map((cat, index) => (
                                                <tr
                                                    key={cat._id}
                                                    className="border-t dm-sans font-bold border-gray-200 hover:bg-gray-50 transition-colors h-16"
                                                >
                                                    <td className="py-1 px-11">{index + 1}.</td>

                                                    <td className="py-1 px-6 text-[109%] font-normal text-[#000000]">
                                                        {cat.category_name}
                                                    </td>

                                                    <td className="py-1 px-6">
                                                        {cat.image ? (
                                                            <img
                                                                src={cat.image}
                                                                alt={cat.category_name}
                                                                className="w-12 h-12 object-cover rounded-md border"
                                                            />
                                                        ) : (
                                                            <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500 border">
                                                                No Img
                                                            </div>
                                                        )}
                                                    </td>

                                                    <td className="py-1 px-6 text-right flex justify-end gap-4">
                                                        <button onClick={() => handleEdit(cat)}>
                                                            <img src={edit} alt="Edit" className="w-5 h-5" />
                                                        </button>
                                                        <button onClick={() => handleDelete(cat._id)}>
                                                            <img src={deleteIcon} alt="Delete" className="w-5 h-5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}

                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* ✅ MOBILE + TABLET VIEW (cards) */}
                        <div className="md:hidden grid gap-4 mt-3">

                            {filteredCategories.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-10 animate-fadeIn">
                                    <img
                                        src="https://cdn-icons-png.flaticon.com/512/7465/7465705.png"
                                        alt="No data"
                                        className="w-24 h-24 opacity-90 mb-3"
                                    />
                                    <h2 className="text-lg font-semibold text-gray-700">No Categories Found</h2>
                                    <p className="text-gray-500 text-sm mt-1">Try adding a new category or change your search.</p>
                                </div>
                            ) : (
                                filteredCategories.map((cat, index) => (
                                    <div
                                        key={cat._id}
                                        className="border rounded-xl p-4 shadow-sm bg-white flex gap-4 items-center"
                                    >
                                        {/* Image */}
                                        {cat.image ? (
                                            <img
                                                src={cat.image}
                                                alt={cat.category_name}
                                                className="w-16 h-16 object-cover rounded-lg border"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-500 border">
                                                No Img
                                            </div>
                                        )}

                                        <div className="flex flex-col flex-1">
                                            <p className="text-xs text-gray-500">#{index + 1}</p>

                                            <h3 className="font-semibold text-black text-[17px]">
                                                {cat.category_name}
                                            </h3>

                                            <div className="flex justify-end gap-5 mt-3">
                                                <button onClick={() => handleEdit(cat)}>
                                                    <img src={edit} alt="Edit" className="w-5 h-5" />
                                                </button>

                                                <button onClick={() => handleDelete(cat._id)}>
                                                    <img src={deleteIcon} alt="Delete" className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}

                        </div>

                    </div>

                </div>

            </div>
            {showModal && selectedCategory && (
                <div className="fixed inset-0 z-50 text-black flex items-center justify-center bg-black/40 px-4">
                    <div className="bg-white rounded-2xl w-full max-w-[420px] p-6 shadow-xl animate-fadeIn">

                        <h2 className="text-xl font-semibold text-center mb-6">Edit Category</h2>

                        <form onSubmit={handleSubmitEdit(onSubmitEdit)}>

                            {/* Category Name */}
                            <div className="mb-5">
                                <input
                                    type="text"
                                    {...registerEdit("name", { required: "Category name is required" })}
                                    placeholder="e.g. Starters"
                                    className="w-full border border-[#D9D9D9] px-4 py-3 rounded-md focus:outline-none focus:border-orange-500"
                                />
                                {editErrors.name && <p className="text-red-500 text-xs mt-1">{editErrors.name.message}</p>}
                            </div>

                            {/* Upload New Image */}
                            <label className="block mb-6 cursor-pointer">
                                <div className="border-2 border-dashed border-[#B4B4B4CC] rounded-lg py-8 text-center hover:bg-gray-50 transition">
                                    <Icon icon="mdi:upload" className="mx-auto text-[#B4B4B4CC] w-10 h-10 mb-2" />
                                    <p className="text-sm text-[#5E5E5E]">Upload new image (optional)</p>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => e.target.files[0] && setEditImageFile(e.target.files[0])}
                                />
                            </label>

                            {editImageFile && (
                                <div className="mb-4 flex justify-center">
                                    <img
                                        src={URL.createObjectURL(editImageFile)}
                                        alt="Preview"
                                        className="w-28 h-28 object-cover rounded-lg border"
                                    />
                                </div>
                            )}


                            {/* Buttons */}
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setSelectedCategory(null);
                                        setEditImageFile(null);
                                        resetEdit();
                                    }}
                                    className="flex-1 py-3 border border-[#FF6F00] text-[#FF6F00] rounded-md font-medium hover:bg-orange-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-gradient-to-r from-[#FF6F00] to-[#FF9933] text-white rounded-md font-medium"
                                >
                                    Update Category
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddCategories;
