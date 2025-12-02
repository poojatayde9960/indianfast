import React, { useState } from "react";
import { Icon } from "@iconify/react";
import AddCategories from "./addCatogries";
import edit from "/edit.png";
import food from "/food.jpg";
import deleteIcon from "/delete.png";
import { useNavigate, useOutletContext } from "react-router-dom";
import AddItems from "./AddItem";
import { useAddProductMutation, useCategoriesAddMutation, useGetAllCategoriesQuery } from "../../redux/apis/categoriesApi";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const FoodItem = () => {
    const { data } = useGetAllCategoriesQuery();
    const [AddProduct] = useAddProductMutation()
    // const [categoriesAdd] = useCategoriesAddMutation();
    const [categoriesAdd, { isLoading, isSuccess, isError }] = useCategoriesAddMutation();

    const navigate = useNavigate();

    const [showCategories, setShowCategories] = useState(false);
    const [showAddSection, setShowAddSection] = useState(false);

    const { searchTerm } = useOutletContext();
    const [selectedFoodCategory, setSelectedFoodCategory] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [showItemModal, setShowItemModal] = useState(false);
    const [activeCard, setActiveCard] = useState("card2");
    const shopId = useSelector((state) => state.auth.shopId);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        defaultValues: {
            categoryName: "",
            categoryImage: null,
        },
    });

    const onSubmitCategory = async (data) => {
        const formData = new FormData();
        formData.append("name", data.categoryName);
        formData.append("shopId", shopId);

        if (data.categoryImage?.[0]) {
            formData.append("image", data.categoryImage[0]);
        }

        try {
            await categoriesAdd(formData).unwrap();

            reset();
            setShowModal(false);
            setShowCategories(true);
            setActiveCard("card1");
            toast.success("Category added successfully!");
        } catch (err) {
            console.log("Error:", err);
        }
    };


    // ========== React Hook Form for Items ==========
    const {
        register: registerItem,
        handleSubmit: handleSubmitItem,
        formState: { errors: itemErrors },
        reset: resetItem
    } = useForm({
        defaultValues: {
            itemName: "",
            description: "",
            price: "",
            category: "",
            preparationTime: "",
            foodType: "",
            itemImage: null,
            gst: "",
            discount: ""
        },
    });

    const onSubmitItem = async (data) => {
        try {
            const formData = new FormData();

            formData.append("name", data.itemName);
            formData.append("description", data.description);
            formData.append("price", data.price);
            // formData.append("category_name", data.category);
            formData.append("category_name", selectedFoodCategory);

            formData.append("preparationTime", data.preparationTime);
            formData.append("foodType", data.foodType);
            formData.append("gst", data.gst);
            formData.append("discount", data.discount);
            formData.append("shopId", shopId);

            if (data.itemImage?.[0]) {
                formData.append("image", data.itemImage[0]);
            }

            const response = await AddProduct(formData).unwrap();
            console.log("Item Added Successfully:", response);

            resetItem();
            setShowItemModal(false);
            setShowAddSection(true);
            setActiveCard("card2");
            setShowCategories(false);
            toast.success("Product added successfully!");
        } catch (error) {
            console.log("Error while adding item:", error);
        }
    };

    return <>

        {/* <pre className="text-black">{JSON.stringify(data, null, 2)}</pre> */}
        <div className="p-4 sm:p-5 md:p-6 bg-[#F5F5F5] mt-20 min-h-[calc(100vh-80px)] md:h-[calc(100vh-80px)] overflow-y-auto transition-all duration-500">

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 justify-items-center md:justify-items-start">

                {/* Card 1 */}
                <div
                    onClick={() => {
                        setShowAddSection(false);
                        setActiveCard("card1");
                        setShowCategories(true);
                    }}
                    className={`bg-white rounded-3xl w-full sm:w-[85%] md:w-[90%] lg:w-[60%] shadow-[0_4px_20px_0_rgba(0,0,0,0.1)]
            p-5 flex flex-col justify-between cursor-pointer hover:shadow-lg transition-all duration-200
            ${activeCard === "card1" ? "border-2 border-[#FF9129]" : "border border-transparent"}`}
                >
                    <div className="flex justify-between items-center flex-wrap gap-3">
                        <h3 className="text-[#1E1E1E] text-sm sm:text-base font-Poppins mb-2 sm:mb-6 -mt-1">
                            Total Categories
                        </h3>

                        <div className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-[#3F922426]">
                            <Icon icon="fluent:food-28-regular" className="text-[#EF9C01] w-6 h-6 sm:w-7 sm:h-7" />
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl sm:text-2xl md:text-3xl text-gray-900 -mt-2 md:-mt-3">  {data?.length || 0}</h2>

                        <span
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowModal(true);
                            }}
                            className="text-base sm:text-lg md:text-xl text-[#19700B] font-semibold mt-3 px-2 py-[2px] cursor-pointer font-Poppins hover:underline"
                        >
                            + Add Category
                        </span>
                    </div>
                </div>

                {/* Card 2 */}
                <div
                    onClick={() => {
                        setShowAddSection(false);
                        setActiveCard("card2");
                        setShowCategories(false);
                    }}
                    className={`bg-white rounded-3xl w-full sm:w-[85%] md:w-[90%] lg:w-[60%] 
            lg:ml-[-35%] shadow-[0_4px_20px_0_rgba(0,0,0,0.1)] 
            p-5 flex flex-col justify-between cursor-pointer hover:shadow-lg transition-all duration-200
            ${activeCard === "card2" ? "border-2 border-[#FF9129]" : "border border-transparent"}`}
                >
                    <div className="flex justify-between items-center flex-wrap gap-3">
                        <h3 className="text-[#1E1E1E] text-sm sm:text-base font-Poppins mb-2 sm:mb-6 -mt-1">
                            Total Food Items
                        </h3>

                        <div className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-[#3F922426]">
                            <Icon icon="fluent:food-28-regular" className="text-[#EF9C01] w-6 h-6 sm:w-7 sm:h-7" />
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl sm:text-2xl md:text-3xl text-gray-900 -mt-2 md:-mt-3">{data?.reduce((total, cat) => total + (cat.products?.length || 0), 0) || 0}</h2>

                        <span
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowItemModal(true);
                            }}
                            className="text-base sm:text-lg md:text-xl text-[#19700B] font-semibold mt-3 px-2 py-[2px] cursor-pointer font-Poppins hover:underline"
                        >
                            + Add Item
                        </span>
                    </div>
                </div>
            </div>

            {/* Conditional Section */}
            {showCategories ? <AddCategories searchTerm={searchTerm} /> : <AddItems searchTerm={searchTerm} />}

            {/* =================== CATEGORY MODAL =================== */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 px-4 sm:px-6">
                    <form
                        onSubmit={handleSubmit(onSubmitCategory)}
                        className="bg-white rounded-2xl w-full max-w-[380px] sm:max-w-[400px] md:max-w-[420px] p-5 sm:p-6 md:p-8 shadow-lg relative animate-fadeIn"
                    >
                        <h2 className="text-[16px] sm:text-[18px] font-medium text-[#1E1E1E] mb-1">Category Name</h2>

                        <input
                            type="text"
                            {...register("categoryName", { required: "Category name is required" })}
                            placeholder="e.g. starter"
                            className="w-full border text-black border-[#D9D9D9] mb-2 px-4 py-2.5 sm:py-3 rounded-sm"
                        />

                        {errors.categoryName && (
                            <p className="text-red-500 text-sm mb-2">{errors.categoryName.message}</p>
                        )}

                        <label className="w-full border border-dashed border-[#B4B4B4CC] rounded-md flex items-center justify-center px-4 py-[14px] text-[15px] text-[#5E5E5E] cursor-pointer">
                            <Icon icon="mdi:upload" className="text-[#B4B4B4CC] w-6 h-6 mr-2" />
                            <span>Upload Image of food</span>

                            <input
                                type="file"
                                accept="image/*"
                                {...register("categoryImage")}
                                className="hidden"
                            />
                        </label>

                        <div className="flex justify-center gap-5 mt-6">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="w-full py-3 border border-[#FF6F00] text-[#FF6F00] rounded-md"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="w-full py-3 text-white rounded-md bg-gradient-to-r from-[#FF6F00] to-[#FF9933]"
                            >
                                Add Category
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* =================== ITEM MODAL =================== */}
            {showItemModal && (
                <div className="fixed inset-0 z-50 flex items-start text-black justify-center bg-black/40 px-3 pt-4 pb-8 overflow-y-auto">
                    {/* items-start + pt-4 → modal top la nahi chikat, scroll comfortable */}
                    <form
                        onSubmit={handleSubmitItem(onSubmitItem)}
                        className="bg-white rounded-2xl w-full max-w-[500px] sm:max-w-[650px] md:max-w-[50%] p-5 sm:p-6 md:p-7 shadow-lg relative max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    // className="bg-white rounded-2xl w-full sm:max-w-[650px] md:max-w-[50%] p-6 sm:p-7 shadow-lg relative animate-fadeIn"
                    >
                        {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-6"></div> */}
                        {/* > */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">

                            <div>
                                <label className="block mb-1 text-sm">Item Name</label>
                                <input
                                    type="text"
                                    placeholder="Item Name"
                                    {...registerItem("itemName", { required: "Item name required" })}
                                    className="w-full border border-[#D9D9D9] px-4 py-4 rounded-md text-base"
                                />
                                {itemErrors.itemName && (
                                    <p className="text-red-500 text-sm mt-1">{itemErrors.itemName.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block mb-1 text-sm">Description</label>
                                <input
                                    type="text"
                                    placeholder="Description"
                                    {...registerItem("description")}
                                    className="w-full border border-[#D9D9D9] px-4 py-4 rounded-md text-base"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm">Price</label>
                                <input
                                    type="number"
                                    placeholder="number"
                                    {...registerItem("price")}
                                    className="w-full border border-[#D9D9D9] px-4 py-4 rounded-md text-base"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm">Category</label>
                                <select
                                    {...registerItem("category")}
                                    className="w-full border border-[#D9D9D9] px-4 py-4 rounded-md text-base"
                                    defaultValue=""
                                >
                                    <option value="" disabled>Select category</option>
                                    <option value="Veg">Veg</option>
                                    <option value="Non-Veg">Non-Veg</option>
                                </select>
                            </div>

                            <div>
                                <label className="block mb-1 text-sm">Preparation Time</label>
                                <input
                                    type="text"
                                    placeholder="preparation Time"
                                    {...registerItem("preparationTime")}
                                    className="w-full border border-[#D9D9D9] px-4 py-4 rounded-md text-base"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium">Select Food Category</label>
                                <select
                                    {...registerItem("foodType", { required: "Category is required" })}
                                    className="w-full border border-[#D9D9D9] px-4 py-4 rounded-md bg-white text-base"
                                    value={selectedFoodCategory}
                                    onChange={(e) => setSelectedFoodCategory(e.target.value)}
                                >
                                    <option value="">Select Category</option>
                                    {data?.map((cat) => (
                                        <option key={cat._id} value={cat.category_name}>
                                            {cat.category_name}
                                        </option>
                                    ))}
                                </select>
                                {itemErrors.foodType && (
                                    <p className="text-red-500 text-sm mt-1">{itemErrors.foodType.message}</p>
                                )}
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block mb-2 text-sm">Upload Image</label>
                                <label className="w-full border border-dashed border-[#B4B4B4CC] rounded-md flex items-center justify-center px-4 py-[14px] cursor-pointer hover:bg-gray-50 transition">
                                    <Icon icon="mdi:upload" className="text-[#B4B4B4CC] w-6 h-6 mr-2" />
                                    <span className="text-sm">Upload Image of food</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        {...registerItem("itemImage")}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            <div>
                                <label className="block mb-1 text-sm">GST</label>
                                <input
                                    type="number"
                                    {...registerItem("gst")}
                                    className="w-full border border-[#D9D9D9] px-4 py-4 rounded-md text-base"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm">Discount</label>
                                <input
                                    type="number"
                                    {...registerItem("discount")}
                                    className="w-full border border-[#D9D9D9] px-4 py-4 rounded-md text-base"
                                />
                            </div>

                        </div>

                        {/* Buttons - Mobile var full width, stacked */}
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-8 sm:mt-10">
                            <button
                                type="button"
                                onClick={() => setShowItemModal(false)}
                                className="w-full sm:w-[170px] py-3 border border-[#FF6F00] text-[#FF6F00] rounded-sm font-medium hover:bg-orange-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="w-full sm:w-[170px] py-3 text-white rounded-sm bg-gradient-to-r from-[#FF6F00] to-[#FF9933] font-medium"
                            >
                                Add Item
                            </button>
                        </div>
                    </form>
                </div>
            )}

        </div>
    </>
};

export default FoodItem;
