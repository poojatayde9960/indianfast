import React, { useState } from "react";
import { Icon } from "@iconify/react";

const Coupons = () => {
    const [showModal, setShowModal] = useState(false);

    // Outside click handle
    const handleOutsideClick = (e) => {
        if (e.target.id === "modalOverlay") {
            setShowModal(false);
        }
    };

    return (
        <div className="p-4 sm:p-5 md:p-6 bg-[#F5F5F5] mt-20 min-h-[calc(100vh-80px)] md:h-[calc(100vh-80px)] overflow-y-auto transition-all duration-500">

            {/* // <div className="bg-[#F5F5F5] min-h-screen p-8 mt-10"> */}
            {/* Add Coupon Button */}


            <button
                onClick={() => setShowModal(true)}
                className="bg-[#3F9224] ml-[87%] hover:bg-[#43A047] mt-5 text-white px-7 py-3 font-normal text-[109%]  transition-all"
            >
                + Add Coupon
            </button>

            {/* Table Section */}
            <div className="bg-white mt-5 mx-auto w-[99%] p-6 min-h-[560px]">
                <div className="grid grid-cols-7 bg-[#F3F3F3] text-[#000000B5] font-medium py-4 px-7">
                    <p className="ml-6">Food Item</p>
                    <p className="ml-6">Min Order</p>
                    <p className="ml-6">Coupon Code</p>
                    <p className="ml-6">Coupon Discount</p>
                    <p className="ml-6">Start Date</p>
                    <p className="ml-6">End Date</p>
                    <p className="ml-6">Action</p>
                </div>

                <div className="grid grid-cols-7 text-[95%] font-normal text-[#000000B5] py-4 px-6">
                    <p className="ml-6">Pavbhaji</p>
                    <p className="ml-6">Rs.200</p>
                    <p className="ml-6">INDIANFAST</p>
                    <p className="ml-6">Rs.100</p>
                    <p className="ml-6">10/08/2025</p>
                    <p className="ml-6">12/08/2025</p>
                    <div className="flex ml-6 items-center gap-4">
                        <Icon icon="mdi-light:delete" className="text-[160%] text-[#E10202] cursor-pointer" />
                        <Icon icon="mynaui:edit" className="text-[160%] text-black cursor-pointer" />
                    </div>
                </div>
            </div>

            {/* Add Coupon Modal */}
            {showModal && (
                <div
                    id="modalOverlay"
                    onClick={handleOutsideClick}
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                >
                    <div className="bg-white rounded-2xl w-[850px] p-8 shadow-lg relative">
                        {/* Form */}
                        <div className="grid grid-cols-2 gap-6 mt-4">
                            {/* Left Column */}
                            <div>
                                <label className="block text-[#000] mb-2 text-[120%]">Select Food Item</label>
                                <div className="relative">
                                    <select
                                        className="w-full bg-[#F3F3F3] p-4 focus:outline-none appearance-none text-[#000000B5]"
                                    >
                                        <option>Enter</option>
                                    </select>
                                    <Icon
                                        icon="weui:arrow-outlined"
                                        className="absolute right-3 top-3 text-[#000000B5]"
                                        style={{ width: "12px", height: "24px", transform: "rotate(-89.3deg)" }}
                                    />
                                </div>

                                <label className="block text-[#000] mt-5 mb-2 text-[120%]">Min Order</label>
                                <input
                                    type="text"
                                    placeholder="Rs.200"
                                    className="w-full bg-[#F3F3F3] p-4 focus:outline-none placeholder-[#000000B5]"
                                />

                                <label className="block text-[#000] mt-5 mb-2 text-[120%]">Coupon Code</label>
                                <input
                                    type="text"
                                    placeholder="Enter"
                                    className="w-full bg-[#F3F3F3] p-4 focus:outline-none placeholder-[#000000B5]"
                                />
                            </div>

                            {/* Right Column */}
                            <div>
                                <label className="block text-[#000] mb-2 text-[120%]">Valid From</label>
                                <div className="flex items-center bg-[#F3F3F3] p-4">
                                    <input
                                        type="text"
                                        placeholder=""
                                        className="w-full bg-transparent focus:outline-none placeholder-[#000000B5]"
                                    />
                                    <Icon
                                        icon="solar:calendar-outline"
                                        className="text-[#000000]"
                                        style={{ width: "22px", height: "22px" }}
                                    />
                                </div>

                                <label className="block text-[#000] mt-5 mb-2 text-[120%]">To</label>
                                <div className="flex items-center bg-[#F3F3F3] p-4">
                                    <input
                                        type="text"
                                        placeholder=""
                                        className="w-full bg-transparent focus:outline-none placeholder-[#000000B5]"
                                    />
                                    <Icon
                                        icon="solar:calendar-outline"
                                        className="text-[#000000]"
                                        style={{ width: "22px", height: "22px" }}
                                    />
                                </div>

                                <label className="block text-[#000] mt-5 mb-2 text-[120%]">Coupon Discount</label>
                                <input
                                    type="text"
                                    placeholder="Enter"
                                    className="w-full bg-[#F3F3F3] p-4 focus:outline-none placeholder-[#000000B5]"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-center mt-8">
                            <button
                                onClick={() => setShowModal(false)} // ✅ Close modal on click
                                className="bg-[#3F9224] text-white px-9 py-3 rounded-xl text-[120%] hover:bg-[#35801f] transition"
                            >
                                Add Coupon
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Coupons;
