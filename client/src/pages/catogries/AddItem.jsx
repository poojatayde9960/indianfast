import React, { useState, useEffect } from "react";
import edit from "/edit.png";
import deleteIcon from "/delete.png";
import {
    useGetAllCategoriesQuery,
    useProductToggleMutation,
    useDeleteProductMutation,
    useEditProductMutation
} from "../../redux/apis/categoriesApi";
import { useForm } from "react-hook-form";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";

const AddItem = ({ searchTerm }) => {
    const [editProduct] = useEditProductMutation();
    const { data: categoriesData, isLoading } = useGetAllCategoriesQuery(undefined, { refetchOnMountOrArgChange: true });
    const [productToggle, { isLoading: toggleLoading }] = useProductToggleMutation();
    const [deleteProduct] = useDeleteProductMutation();

    const [activeCategory, setActiveCategory] = useState("");
    const [editModal, setEditModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    // **Auto select first category**
    useEffect(() => {
        if (categoriesData?.length > 0 && !activeCategory) {
            setActiveCategory(categoriesData[0].category_name);
        }
    }, [categoriesData, activeCategory]);


    const openEditModal = (item) => {
        setSelectedItem(item);
        setImageFile(null);

        reset({
            name: item.name,
            description: item.description,
            price: item.price,
            preparationTime: item.preparationTime,
            gst: item.gst,
            discountedPrice: item.discountedPrice,
            category_name: item.category_name,
        });

        setEditModal(true);
    };


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) setImageFile(file);
    };


    const handleDelete = async (productId) => {
        if (!confirm("Are you sure you want to delete this item?")) return;

        try {
            await deleteProduct(productId).unwrap();
            // alert("Deleted successfully");
            toast.error("Deleted successfully!");
        } catch (error) {
            alert(error?.data?.message || "Failed to delete product");
        }
    };

    // **Filtered products**
    const filteredProducts =
        (searchTerm
            ? categoriesData?.flatMap(cat =>
                cat.products?.filter(p =>
                    p.name?.toLowerCase()?.includes(searchTerm.toLowerCase())
                )
            )
            : categoriesData?.find(cat => cat.category_name === activeCategory)?.products) || [];

    const onSubmitEdit = async (data) => {
        if (!selectedItem?._id) return;

        // Find the correct category name
        let categoryName = data.category_name;
        if (!categoryName && categoriesData) {
            const category = categoriesData.find(cat => cat.products.some(p => p._id === selectedItem._id));
            if (category) {
                categoryName = category.category_name;
            }
        }
        // Fallback to selectedItem.foodCategory if available
        if (!categoryName && selectedItem.foodCategory) {
            categoryName = selectedItem.foodCategory;
        }

        try {
            let dataToSend;

            if (imageFile) {
                const formData = new FormData();
                const appendIfDefined = (key, value) => {
                    if (value !== undefined && value !== null && value !== "undefined") {
                        formData.append(key, value);
                    }
                };

                appendIfDefined("name", data.name?.trim());
                appendIfDefined("description", data.description?.trim());
                appendIfDefined("price", data.price);
                appendIfDefined("preparationTime", data.preparationTime);
                appendIfDefined("gst", data.gst);
                appendIfDefined("discountedPrice", data.discountedPrice);

                // Send the correctly resolved category_name
                appendIfDefined("category_name", categoryName);

                formData.append("image", imageFile);

                // Log FormData entries
                for (let [key, value] of formData.entries()) {
                    console.log(`FormData: ${key} = ${value}`);
                }

                dataToSend = formData;
            } else {
                dataToSend = {
                    name: data.name?.trim() || "",
                    description: data.description?.trim() || "",
                    price: Number(data.price) || 0,
                    preparationTime: Number(data.preparationTime) || 0,
                    gst: Number(data.gst) || 0,
                    discountedPrice: Number(data.discountedPrice) || 0,
                    category_name: categoryName
                };
                console.log("Sending JSON Data:", dataToSend);
            }

            await editProduct({
                id: selectedItem._id,
                formData: dataToSend
            }).unwrap();

            toast.success("Item updated successfully!");
            setEditModal(false);
            reset();
            setImageFile(null);

        } catch (err) {
            console.error("Edit Product Error:", err);
            toast.error(err?.data?.message || "Update failed");
        }
    };
    if (isLoading) {
        return (
            <div className="bg-white rounded-[15px] border shadow p-5 animate-pulse">
                <div className="h-6 w-40 bg-slate-300 rounded mb-6"></div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                        <thead>
                            <tr>
                                <th className="px-5 py-3">
                                    <div className="h-4 w-16 bg-slate-300 rounded"></div>
                                </th>
                                <th className="px-5 py-3">
                                    <div className="h-4 w-24 bg-slate-300 rounded"></div>
                                </th>
                                <th className="px-5 py-3">
                                    <div className="h-4 w-28 bg-slate-300 rounded"></div>
                                </th>
                                <th className="px-5 py-3">
                                    <div className="h-4 w-20 bg-slate-300 rounded"></div>
                                </th>
                                <th className="px-5 py-3">
                                    <div className="h-4 w-16 bg-slate-300 rounded"></div>
                                </th>
                                <th className="px-5 py-3">
                                    <div className="h-4 w-14 bg-slate-300 rounded"></div>
                                </th>
                                <th className="px-5 py-3"></th>
                            </tr>
                        </thead>

                        <tbody>
                            {Array.from({ length: 6 }).map((_, idx) => (
                                <tr key={idx} className="border-b">
                                    <td className="px-5 py-4">
                                        <div className="w-14 h-14 bg-slate-300 rounded"></div>
                                    </td>

                                    <td className="px-5 py-4">
                                        <div className="h-3 w-32 bg-slate-300 rounded"></div>
                                    </td>

                                    <td className="px-5 py-4">
                                        <div className="h-3 w-48 bg-slate-300 rounded"></div>
                                    </td>

                                    <td className="px-5 py-4">
                                        <div className="h-3 w-20 bg-slate-300 rounded"></div>
                                    </td>

                                    <td className="px-5 py-4">
                                        <div className="h-3 w-16 bg-slate-300 rounded"></div>
                                    </td>

                                    <td className="px-5 py-4">
                                        <div className="h-3 w-20 bg-slate-300 rounded"></div>
                                    </td>

                                    <td className="px-5 py-4">
                                        <div className="flex gap-4">
                                            <div className="w-5 h-5 bg-slate-300 rounded"></div>
                                            <div className="w-5 h-5 bg-slate-300 rounded"></div>
                                            <div className="w-10 h-5 bg-slate-300 rounded-full"></div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }


    return <>
        {/* <pre className="text-black">{JSON.stringify(data, null, 2)}</pre> */}
        {/* Category Buttons */}
        {!searchTerm && (
            <div className="flex flex-wrap gap-3 mb-5">
                {categoriesData?.map(cat => (
                    <button
                        key={cat._id}
                        onClick={() => setActiveCategory(cat.category_name)}
                        className={`px-5 py-2 rounded-[6px] transition-all ${activeCategory === cat.category_name
                            ? "bg-[#FF9F03] text-white"
                            : "bg-[#D9D9D9]/60 text-[#00000099]"
                            }`}
                    >
                        {cat.category_name}
                    </button>
                ))}
            </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-[15px] border shadow p-5">

            {/* Desktop Table */}
            <div className="overflow-x-auto hidden md:block">
                <table className="w-full min-w-[700px] text-[14px]">
                    <thead className="bg-[#F5F5F5] text-[#000000] h-14">
                        <tr>
                            <th className="text-left px-5">Image</th>
                            <th className="text-left px-5">Item Name</th>
                            <th className="text-left px-5">Description</th>
                            <th className="text-left px-5">Availability</th>
                            <th className="text-left px-5">Prep Time</th>
                            <th className="text-left px-5">Price</th>
                            <th className="text-left px-5"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="py-10">
                                    <div className="flex flex-col items-center justify-center animate-fadeIn">
                                        <img
                                            src="https://cdn-icons-png.flaticon.com/512/4076/4076432.png"
                                            alt="No items"
                                            className="w-28 h-28 opacity-80 mb-3"
                                        />
                                        <h2 className="text-lg font-semibold text-gray-700">No Items Found</h2>
                                        <p className="text-gray-500 mt-1 text-sm">Try adding a new item or change your search.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredProducts.map(item => (
                                <tr key={item._id} className="border-b hover:bg-gray-50">
                                    <td className="py-4 px-5">
                                        <img src={item.image} alt="" className="w-14 h-14 object-cover rounded" />
                                    </td>

                                    <td className="py-4 px-5 font-medium text-black">{item.name}</td>

                                    <td className="py-4 px-5 text-gray-600">{item.description}</td>
                                    {/* <p className={`mt-2 font-medium ${item.available ? "text-green-600" : "text-red-600"}`}>
                                        {item.available ? "Available" : "Not Available"}
                                    </p> */}
                                    <td className={`py-4 px-5 font-medium ${item.available ? "text-green-600" : "text-red-600"}`}>
                                        {item.available ? "Available" : "Not Available"}
                                    </td>

                                    <td className="py-4 text-black px-5">{item.preparationTime} mins</td>

                                    <td className="py-4 text-black px-5">Rs.{item.price}</td>

                                    <td className="py-4 px-5">
                                        <div className="flex items-center gap-4">
                                            <button className="hover:scale-110" onClick={() => openEditModal(item)}>
                                                <img src={edit} alt="edit" className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => handleDelete(item._id)}>
                                                <img src={deleteIcon} alt="delete" className="w-5 h-5" />
                                            </button>
                                            {/*   <button
                                        onClick={() => productToggle(item._id)}
                                        disabled={toggleLoading}
                                        className={`relative w-9 h-5 rounded-full transition-all ${item.available === true || item.available === "Available"
                                            ? "bg-black"
                                            : "bg-gray-400"
                                            } ${toggleLoading ? "opacity-50" : ""}`}
                                    >
                                        <span
                                            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-orange-500 rounded-full transition-transform ${item.available === true || item.available === "Available"
                                                ? "translate-x-4"
                                                : ""
                                                }`}
                                        />
                                    </button> */}
                                            <button
                                                onClick={() => productToggle(item._id)}
                                                disabled={toggleLoading}
                                                className={`relative w-9 h-5 rounded-full transition-all ${item.available === true || item.available === "Available"
                                                    ? "bg-black"
                                                    : "bg-gray-400"} ${toggleLoading ? "opacity-50" : ""}`}
                                            >
                                                <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-orange-500 rounded-full transition-transform ${item.available === true || item.available === "Available"
                                                    ? "translate-x-4"
                                                    : ""}`} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {/* Mobile / Tablet Card View */}
            <div className="md:hidden grid gap-4">
                {filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 animate-fadeIn">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/4076/4076432.png"
                            alt="No items"
                            className="w-24 h-24 opacity-80 mb-3"
                        />
                        <h2 className="text-lg font-semibold text-gray-700">No Items Found</h2>
                        <p className="text-gray-500 text-sm mt-1">Try adding a new item or change your search.</p>
                    </div>
                ) : (
                    filteredProducts.map(item => (
                        <div key={item._id} className="border rounded-xl p-4 shadow-sm flex gap-4">
                            <img src={item.image} alt="img" className="w-20 h-20 object-cover rounded-lg" />
                            <div className="flex flex-col flex-1">
                                <h3 className="font-semibold text-black">{item.name}</h3>
                                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                <p className={`mt-2 font-medium ${item.available ? "text-green-600" : "text-red-600"}`}>
                                    {item.available ? "Available" : "Not Available"}
                                </p>
                                <p className="text-sm mt-1 text-black">Prep: {item.preparationTime} mins</p>
                                <p className="text-sm font-semibold text-black">Rs.{item.price}</p>
                                <div className="flex items-center gap-4 mt-3">
                                    <button className="hover:scale-110" onClick={() => openEditModal(item)}>
                                        <img src={edit} alt="edit" className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => handleDelete(item._id)}>
                                        <img src={deleteIcon} alt="delete" className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => productToggle(item._id)}
                                        disabled={toggleLoading}
                                        className={`relative w-9 h-5 rounded-full transition-all ${item.available === true || item.available === "Available"
                                            ? "bg-black"
                                            : "bg-gray-400"
                                            } ${toggleLoading ? "opacity-50" : ""}`}
                                    >
                                        <span
                                            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-orange-500 rounded-full transition-transform ${item.available === true || item.available === "Available"
                                                ? "translate-x-4"
                                                : ""
                                                }`}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

        </div>


        {/* Edit Modal */}
        {editModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 px-4 sm:px-6">
                <form onSubmit={handleSubmit(onSubmitEdit)} className="bg-white rounded-2xl w-full max-w-[750px] p-6 shadow-lg text-black">
                    <h2 className="text-xl font-semibold mb-6 text-center">Edit Item</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                        {/* Upload */}
                        <div>
                            <label>Upload Image</label>
                            <label className="w-full border border-dashed border-[#B4B4B4CC] rounded-md flex items-center justify-center px-4 py-[12px] cursor-pointer">
                                <Icon icon="mdi:upload" className="text-[#B4B4B4CC] w-6 h-6 mr-2" />
                                <span>Upload Image of food</span>
                                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                            </label>
                        </div>

                        {/* Name */}
                        <div>
                            <label>Item Name</label>
                            <input
                                {...register("name", { required: "Item name required" })}
                                type="text"
                                className="w-full border border-gray-300 px-4 py-3 rounded-md"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label>Description</label>
                            <input
                                {...register("description")}
                                type="text"
                                className="w-full border border-gray-300 px-4 py-3 rounded-md"
                            />
                        </div>

                        {/* Price */}
                        <div>
                            <label>Price</label>
                            <input
                                {...register("price")}
                                type="number"
                                className="w-full border border-gray-300 px-4 py-3 rounded-md"
                            />
                        </div>

                        {/* Prep Time */}
                        <div>
                            <label>Preparation Time</label>
                            <input
                                {...register("preparationTime")}
                                type="number"
                                className="w-full border border-gray-300 px-4 py-3 rounded-md"
                            />
                        </div>
                    </div>

                    <div className="flex justify-center gap-6 mt-10">
                        <button
                            type="button"
                            onClick={() => setEditModal(false)}
                            className="w-[170px] py-3 border border-orange-600 text-orange-600 rounded-sm"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="w-[170px] py-3 text-white rounded-sm bg-gradient-to-r from-orange-600 to-orange-400"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        )}
    </>

};

export default AddItem;
