import React, { useState } from "react";
import { Icon } from "@iconify/react";
import vector from "/vector.png";
const TotalOrders = () => {
    const [activeTab, setActiveTab] = useState("Requests (10)");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [orders, setOrders] = useState([
        {
            name: "John Doe",
            totalItems: 4,
            contact: "7485748574",
            address: "Golden City Center Sambhajinagar",
            prepTime: "15–20 Min",
            price: "Rs.100",
            dateTime: "12/08/2025 10:00 Am",
            status: "Completed",
        },
        {
            name: "Jane Smith",
            totalItems: 2,
            contact: "9876543210",
            address: "City Mall Aurangabad",
            prepTime: "10–15 Min",
            price: "Rs.250",
            dateTime: "11/08/2025 09:30 Am",
            status: "Ongoing",
        },
        {
            name: "Rohit Patil",
            totalItems: 3,
            contact: "8456789098",
            address: "Prozone Mall Aurangabad",
            prepTime: "20–25 Min",
            price: "Rs.180",
            dateTime: "10/08/2025 12:00 Pm",
            status: "Rejected",
        },
    ]);

    const tabs = [
        "Requests (10)",
        "All Orders (20)",
        "Ongoing (1)",
        "Ready (2)",
        "Completed (3)",
        "Rejected (3)",
    ];

    // ✅ Logic for button click
    const handleMarkAsReady = (index) => {
        const updated = [...orders];
        updated[index].status = "Ready";
        setOrders(updated);
        setActiveTab("Ready (2)");
    };

    const handleDeliveryPickedUp = (index) => {
        const updated = [...orders];
        updated[index].status = "Completed";
        setOrders(updated);
        setActiveTab("Completed (3)");
    };

    return (
        <div className="p-4 sm:p-5 md:p-6 bg-[#F5F5F5] mt-20 min-h-[calc(100vh-80px)] md:h-[calc(100vh-80px)] overflow-y-auto transition-all duration-500">
            {/* Tabs */}
            <div className="flex flex-wrap gap-24 text-[17px]  text-[#808080]">
                {tabs.map((tab) => (
                    <span
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`cursor-pointer pb-3 transition-all font-medium text-[107%] duration-200 ${activeTab === tab
                            ? "text-[#FF9129] "
                            : "hover:text-[#FF9129]"
                            }`}
                    >
                        {tab}
                    </span>
                ))}

                <div className="flex items-center gap-2 cursor-pointer hover:text-[#FF9129] transition ml-5">
                    <span className="mb-2 mr-3 text-[110%] text-black font-medium">Filter</span>
                    <Icon
                        icon="mdi:filter-outline"
                        className="text-[220%] font-medium text-black cursor-pointer"
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                    />

                </div>
            </div>

            {/* Table */}
            <div className="bg-white mt-6 shadow-[0_4px_20px_rgba(0,0,0,0.2)]  p-4 md:p-6 min-h-[700px]">
                <div className="overflow-hidden mt-5">
                    <table className="w-full border-collapse text-left text-gray-800">
                        <thead className="bg-gray-100 h-16 text-[15px] font-medium text-[#444]">
                            <tr>
                                <th className="py-3 px-6">Customer Name</th>
                                <th className="py-3 px-6">Total Items</th>
                                <th className="py-3 px-6">Contact No</th>
                                <th className="py-3 px-9">Address</th>
                                <th className="py-3 px-6">Prep Time</th>
                                <th className="py-3 px-6">Price</th>
                                <th className="py-3 px-6">Date & Time</th>
                                <th className="py-3 px-6 text-center">
                                    {activeTab === "Requests (10)" ? "Action" : "Status"}
                                </th>
                            </tr>
                        </thead>

                        <tbody className="text-[15px]">
                            {orders.map((order, index) => (
                                <tr
                                    key={index}
                                    className="border-t h-20 text-[#000000] font-medium border-gray-200 hover:bg-gray-50 transition"
                                >
                                    <td className="py-3 px-6">{order.name}</td>
                                    <td className="py-3 px-6 flex items-center gap-6">
                                        {order.totalItems}
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="text-[#0046AF] underline text-[14px] hover:text-blue-800"
                                        >
                                            View
                                        </button>

                                    </td>
                                    <td className="py-3 px-6">{order.contact}</td>
                                    <td className="py-3 px-6 whitespace-normal break-words max-w-[200px] leading-snug">
                                        {order.address}
                                    </td>
                                    <td className="py-3 px-6">{order.prepTime}</td>
                                    <td className="py-3 px-6">{order.price}</td>
                                    <td className="py-3 px-6">
                                        <div className="flex flex-col items-start">
                                            <span>{order.dateTime.split(" ")[0]}</span>
                                            <span className="text-[000000] text-[13px]">{order.dateTime.split(" ")[1]} {order.dateTime.split(" ")[2]}</span>
                                        </div>
                                    </td>


                                    {/* ✅ Conditional Action / Status */}
                                    <td className="py-3 px-6 text-center">
                                        {activeTab === "Requests (10)" ? (
                                            <div className="flex items-center justify-center gap-3">
                                                <Icon
                                                    icon="mdi:check-circle"
                                                    className="text-green-500 text-[24px] cursor-pointer hover:scale-110 transition"
                                                />
                                                <Icon
                                                    icon="mdi:close-circle"
                                                    className="text-red-500 text-[24px] cursor-pointer hover:scale-110 transition"
                                                />
                                            </div>
                                        ) : activeTab === "Ongoing (1)" ? (
                                            <button
                                                onClick={() => handleMarkAsReady(index)}
                                                className="text-white text-sm font-semibold rounded-md"
                                                style={{
                                                    background:
                                                        "linear-gradient(90deg, #FF9129 0%, #F6552D 100%)",
                                                    width: "99px",
                                                    height: "25px",
                                                    borderRadius: "5px",
                                                }}
                                            >
                                                Mark As Ready
                                            </button>
                                        ) : activeTab === "Ready (2)" ? (
                                            <button
                                                onClick={() => handleDeliveryPickedUp(index)}
                                                className="text-white text-sm font-semibold rounded-md"
                                                style={{
                                                    background:
                                                        "linear-gradient(90deg, #FF9129 0%, #F6552D 100%)",
                                                    width: "150px",
                                                    height: "25px",
                                                    borderRadius: "5px",
                                                }}
                                            >
                                                Delivery Picked Up
                                            </button>
                                        ) : activeTab === "Completed (3)" ? (
                                            <span className="text-[#19700B]  px-4 py-1 rounded-md text-sm font-semibold">
                                                Completed
                                            </span>
                                        ) : activeTab === "Rejected (3)" ? (
                                            <span className="text-red-600  px-4 py-1 rounded-md text-sm font-semibold">
                                                Rejected
                                            </span>
                                        ) : (
                                            <span
                                                className={`px-4 py-1 rounded-md text-sm font-semibold ${order.status === "Completed"
                                                    ? "bg-[#19700B] text-white"
                                                    : order.status === "Ongoing"
                                                        ? "bg-yellow-400 text-white"
                                                        : order.status === "Ready"
                                                            ? "bg-orange-500 text-white"
                                                            : order.status === "Rejected"
                                                                ? "bg-red-600 text-white"
                                                                : "bg-gray-400 text-white"
                                                    }`}
                                            >
                                                {order.status}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {selectedOrder && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
                    <div
                        className="bg-[#FCF7F7] shadow-[0px_1.8px_5.41px_#0000001A,0px_1.8px_3.6px_#0000001A]
                 w-[593px] h-[283px] rounded-[14.42px] p-6 relative "
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedOrder(null)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
                        >
                            ✕
                        </button>

                        {/* Header */}
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-[67px] h-[67px] rounded-full flex items-center justify-center bg-gradient-to-b from-[#FF6F00] to-[#FF9933] shadow-[0_2px_8px_rgba(255,111,0,0.4)]">
                                <img src={vector} alt="food icon" className="w-[18.5px] h-[21.3px]" />
                            </div>
                            <div className="flex-1">
                                <h2 className="font-medium text-3xl font-[DM Sans]   text-black">Order #02</h2>
                                <p className="text-gray-500 text-xl">
                                    2 items • {selectedOrder.dateTime.split(" ")[1]}{" "}
                                    {selectedOrder.dateTime.split(" ")[2]}
                                </p>
                            </div>
                            <span className="text-[#19700B] font-bold text-lg">
                                ₹{selectedOrder.price.replace("Rs.", "")}/-
                            </span>
                        </div>

                        {/* Items List */}
                        <div className="space-y-3 mt-16">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="text-green-600 text-lg">●</span>
                                    <span className="font-semibold text-xl text-gray-800">Paneer Tikka</span>
                                    <span className="text-gray-500 text-xl">x1</span>
                                </div>
                                <span className="font-semibold text-gray-700">₹200/-</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="text-green-600 text-lg">●</span>
                                    <span className="font-semibold text-xl text-gray-800">Butter Naan</span>
                                    <span className="text-gray-500 text-xl">x2</span>
                                </div>
                                <span className="font-semibold text-gray-700 font-DM Sans  ">₹200/-</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {isFilterOpen && (
                <div className="absolute top-16 right-7 bg-white  shadow-lg p-3 w-[121px]">
                    <p className="text-sm text-black hover:text-orange-500 cursor-pointer mb-2">Today</p>
                    <p className="text-sm text-black hover:text-orange-500 cursor-pointer mb-2">Last 7 Days</p>
                    <p className="text-sm text-black hover:text-orange-500 cursor-pointer">3 Months</p>
                </div>
            )}

        </div>
    );
};

export default TotalOrders;
