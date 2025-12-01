import React, { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import edit from "/edit.png";
import deleteIcon from "/delete.png";
import { useRevenueShopMutation } from "../redux/apis/vendorApi";
import { useSelector } from "react-redux";
import vector from "/vector.png";
import veg from "/veg.png";
const Transactions = () => {
    const shopId = useSelector((state) => state.auth.shopId);
    const [revenueShop, { data, isLoading }] = useRevenueShopMutation();
    const [selectedOrder, setSelectedOrder] = useState(null);

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [revenueData, setRevenueData] = useState(null);

    const filterRef = useRef(null);
    const [activeTab, setActiveTab] = useState("Total Transactions");
    const [showFilter, setShowFilter] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    useEffect(() => {
        revenueShop({
            shopId,
            startDate,
            endDate
        })
            .unwrap()
            .then((res) => {
                setRevenueData(res);
            })
            .catch((err) => console.log(err));
    }, [shopId, startDate, endDate]);

    const handleFilter = async () => {
        const res = await revenueShop({
            shopId,
            startDate,
            endDate
        });

        setRevenueData(res.data);
    };
    const filteredTransactions = revenueData?.orders?.map(order => ({
        customerName:
            order?.addressId?.name ||
            order?.userId?.name ||
            order?.userId?.contactNo ||
            "N/A",

        category: order?.services?.[0]?.category_name || "N/A",
        items: order?.services?.[0]?.products?.length || 0,
        type: order.shopId?.hotelType,
        date: order.createdAt.slice(0, 10).split("-").reverse().join("/"),
        amount: order.paymentSummary.finalAmount,
        method: "Online",
        status: order.orderStatus,
        originalOrder: order
    })) || [];


    const lossTransactions = filteredTransactions.filter(
        (tx) => tx.status?.toLowerCase() === "rejected"
    );
    const lossTotal = lossTransactions.reduce((sum, tx) => sum + tx.amount, 0);

    const getAmountColor = () => {
        if (activeTab === "Profit") return "#18780A";
        if (activeTab === "Loss") return "#E60023";
        return "#000000";
    };

    const profitTransactions = filteredTransactions.filter(
        (tx) =>
            tx.amount > 0 &&
            (tx.status?.toLowerCase() === "delivered"
                // tx.status?.toLowerCase() === "completed" ||
                // tx.status?.toLowerCase() === "orderaccepted"
            )
    );

    const profitTotal = profitTransactions.reduce((sum, tx) => sum + tx.amount, 0);
    const profitCount = profitTransactions.length;
    const lossCount = lossTransactions.length;


    useEffect(() => {
        const handleClickOutside = (e) => {
            if (filterRef.current && !filterRef.current.contains(e.target)) {
                setShowFilter(false);
            }
        };

        if (showFilter) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showFilter]);



    // status colour
    const getStatusColor = (status) => {
        if (!status) return "#555";

        switch (status.toLowerCase()) {
            case "delivered":
                return "#18780A";
            case "orderaccepted":
            case "accepted":
                return "#1B76FF";
            case "pickup":
            case "picked":
            case "outfordelivery":
                return "#FF8C00";
            case "rejected":
            case "cancelled":
                return "#E60023";
            case "placeorder":
            case "pending":
                return "#777";
            default:
                return "#555"; // default
        }
    };



    if (isLoading) {
        return (
            <div className="p-4 sm:p-5 md:p-6 bg-[#F5F5F5] mt-20 min-h-[calc(100vh-80px)] md:h-[calc(100vh-80px)] overflow-y-auto">

                {/* Tabs Skeleton */}
                <div className="flex justify-between items-center w-full">
                    <div className="flex gap-20">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div
                                key={i}
                                className="h-5 w-32 bg-slate-300 animate-pulse rounded"
                            ></div>
                        ))}
                    </div>

                    <div className="h-6 w-20 bg-slate-300 animate-pulse rounded mr-44"></div>
                </div>

                {/* Table Skeleton */}
                <div className="bg-white mt-6 shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-4 md:p-6 min-h-[700px] overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-100 h-16">
                                {Array(8).fill(0).map((_, idx) => (
                                    <th key={idx} className="py-3 px-6">
                                        <div className="h-4 bg-slate-300 animate-pulse rounded w-24"></div>
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {Array(6).fill(0).map((_, rowIndex) => (
                                <tr key={rowIndex} className="border-t h-20">
                                    {Array(8).fill(0).map((_, colIndex) => (
                                        <td key={colIndex} className="py-3 px-6">
                                            <div className="h-4 bg-slate-200 animate-pulse rounded w-full"></div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return <>

        {/* <pre className="text-black mt-60">{JSON.stringify(data, null, 2)}</pre> */}

        <div className="p-4 sm:p-5 md:p-6 bg-[#F5F5F5] mt-20 min-h-[calc(100vh-80px)] md:h-[calc(100vh-80px)] overflow-y-auto transition-all duration-500">

            <div
                className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white pr-8 pl-8 p-5 mb-8"
                style={{
                    boxShadow:
                        "0 2px 8px rgba(0,0,0,0.08), 0 -2px 8px rgba(0,0,0,0.04), 2px 0 8px rgba(0,0,0,0.04), -2px 0 8px rgba(0,0,0,0.04)",
                }}
            >
                {/* Total Revenue */}
                <div>
                    <h3 className="text-[#000000] text-[18px] font-medium poppins-medium mb-1">
                        Total Revenue
                    </h3>

                    <p
                        className="text-[32px] dm-sans font-bold"
                        style={{ color: getAmountColor(data?.totalRevenue) }}
                    >
                        ₹ {
                            activeTab === "Loss"
                                ? `${lossTotal}`
                                : activeTab === "Profit"
                                    ? `${profitTotal} `
                                    : `${data?.totalRevenue || 0}`
                        }


                    </p>
                </div>



                <div
                    className="flex flex-col md:flex-row md:items-center 
                md:justify-end items-start justify-start 
                ml-0 md:ml-12 gap-4 mt-4 md:mt-0 w-full md:w-auto relative"
                >
                    {/* Filter */}
                    <div
                        onClick={() => setShowFilter(!showFilter)}
                        className="flex items-center gap-2 text-[#5E5E5E] cursor-pointer"
                    >
                        <span className="text-[16px] font-medium">Filter</span>
                        <Icon icon="mdi:filter-outline" className="text-[22px]" />
                    </div>

                    {showFilter && (
                        <div
                            ref={filterRef}
                            className="absolute top-8 left-0 md:-left-36 -mt-3 bg-white shadow-xl p-4 z-50 w-56 "
                        >
                            <div className="flex flex-col gap-3">

                                <div className="flex flex-col">
                                    <label className="text-[13px] font-medium text-gray-700 mb-1">
                                        Start Date
                                    </label>
                                    <input
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}

                                        type="date"
                                        className="border border-gray-200 text-black rounded px-2 py-1 text-[13px] focus:outline-none focus:border-gray-400"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-[13px] font-medium text-gray-700 mb-1">
                                        End Date
                                    </label>
                                    <input
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        type="date"
                                        className="border border-gray-200 text-black rounded px-2 py-1 text-[13px] focus:outline-none focus:border-gray-400"
                                    />
                                </div>

                                <button
                                    onClick={handleFilter}
                                    className="bg-[#3B82F6] text-white text-[13px] py-1.5 rounded hover:bg-blue-600 transition"
                                >
                                    Apply Filter
                                </button>

                            </div>
                        </div>
                    )}

                    {/* Search Bar */}
                    {/* <div
                        className="flex items-center border border-[#E0E0E0] px-3 py-2 mr-2 bg-white 
            w-full sm:w-[260px] md:w-[280px] lg:w-[320px]"
                    >
                        <Icon
                            icon="ic:twotone-search"
                            className="text-[#808080] font-bold text-[24px]"
                        />
                        <input
                            type="text"
                            placeholder="Search by category or type"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full outline-none text-[15px] md:text-[17px] ml-2 text-[#808080] placeholder-[#BDBDBD] py-[2px]"
                        />


                    </div> */}
                </div>

            </div>

            {/* Tabs */}
            <div className="flex gap-8 border-[#E0E0E0] ">
                {/* Total Transactions */}
                <button
                    onClick={() => setActiveTab("Total Transactions")}
                    className={`relative pb-2 text-[15px] font-medium ${activeTab === "Total Transactions"
                        ? "text-[#000000]"
                        : "text-[#5E5E5E]"
                        }`}
                >
                    <span className="relative text-[105%] inline-block">
                        Total Transactions
                        {activeTab === "Total Transactions" && (
                            <span className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 h-[5px] bg-[#FF9129] rounded-full w-[30%]"></span>
                        )}
                    </span>
                </button>

                {/* Profit */}
                <button
                    onClick={() => setActiveTab("Profit")}
                    className={`relative pb-2 text-[15px] font-medium ${activeTab === "Profit"
                        ? "text-black"
                        : "text-[#5E5E5E]"
                        }`}
                >
                    <span className="relative [105%]  inline-block">
                        Profit
                        {activeTab === "Profit" && (
                            <span className="absolute bottom-[-10px] left-0 right-0 mx-auto h-[5px] bg-[#FF9129] rounded-full w-full"></span>
                        )}
                    </span>
                </button>

                {/* Loss */}
                <button
                    onClick={() => setActiveTab("Loss")}
                    className={`relative pb-2 text-[15px] font-medium ${activeTab === "Loss"
                        ? "text-black"
                        : "text-[#5E5E5E]"
                        }`}
                >
                    <span className="relative [105%] text-[#00000099]  inline-block">
                        Loss
                        {activeTab === "Loss" && (
                            <span className="absolute bottom-[-10px] left-0 right-0 mx-auto h-[5px] bg-[#FF9129] rounded-full w-full"></span>
                        )}
                    </span>
                </button>
            </div>

            {/* Transactions Table */}
            <div className="bg-white mt-8 shadow-[0_4px_20px_rgba(0,0,0,0.1)] rl p-6 w-full mb-6 overflow-x-auto">
                <div className="max-h-[400px] overflow-y-auto">
                    <table className="w-full border-collapse text-left text-gray-800 min-w-[400px]">

                        <thead
                            className="bg-gray-100 h-16 text-[15px] font-medium text-[#444]"
                            style={{
                                position: "sticky",
                                top: 0,
                                zIndex: 10,
                            }}
                        >
                            <tr>
                                <th className="py-3 px-6">Customer Name</th>

                                <th className="py-3 px-6">Category Name</th>
                                <th className="py-3 px-6">Food Items</th>
                                <th className="py-3 px-6">Food Category</th>
                                <th className="py-3 px-6">Order Date</th>
                                <th className="py-3 px-6">Amount</th>
                                <th className="py-3 px-6">Method</th>
                                <th className="py-3 px-6 text-center">Status</th>
                            </tr>
                        </thead>


                        <tbody className="text-[15px]">
                            {(activeTab === "Loss"
                                ? lossTransactions
                                : activeTab === "Profit"
                                    ? profitTransactions
                                    : filteredTransactions
                            ).map((tx, index) => (
                                <tr key={index} className="border-t border-gray-200 hover:bg-gray-50 transition">
                                    <td className="py-3 px-6">{tx.customerName}</td>

                                    <td className="py-3 px-6">{tx.category}</td>
                                    <td className="py-3 px-6">
                                        <button
                                            onClick={() => setSelectedOrder(tx.originalOrder)}
                                            className="text-[#0046AF] underline mt-1 text-[14px] hover:text-blue-800"
                                        >
                                            View
                                        </button>

                                        {/* <button className="text-[#0046AF] underline mt-1 text-[14px] hover:text-blue-800">View</button> */}
                                    </td>
                                    <td className="py-3 px-6">{tx.type}</td>
                                    <td className="py-3 px-6">{tx.date}</td>

                                    <td
                                        className="py-3 px-6"
                                        style={{
                                            color:
                                                activeTab === "Loss"
                                                    ? "#E60023"
                                                    : tx.status?.toLowerCase() === "rejected" || tx.status?.toLowerCase() === "cancelled"
                                                        ? "#E60023"
                                                        : tx.amount > 0
                                                            ? "#18780A"
                                                            : "#E60023",
                                        }}
                                    >
                                        {activeTab === "Loss"
                                            ? `-${Math.abs(tx.amount)}`
                                            : tx.status?.toLowerCase() === "rejected" || tx.status?.toLowerCase() === "cancelled"
                                                ? `-${Math.abs(tx.amount)}`
                                                : tx.amount > 0
                                                    ? `+${tx.amount}`
                                                    : `-${Math.abs(tx.amount)}`}
                                    </td>

                                    <td className="py-3 px-6">{tx.method}</td>
                                    <td
                                        className="py-3 px-6 text-center capitalize font-semibold"
                                        style={{ color: getStatusColor(tx.status) }}
                                    >
                                        {tx.status}
                                    </td>


                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            </div>
        </div>
        {selectedOrder && (
            <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                <div className="bg-white w-[90%] max-w-lg mt-20 md:mt-40 md:mr-12 h-auto max-h-[80vh] md:h-[20%] rounded-2xl p-5 relative shadow-xl overflow-y-auto">

                    {/* Close Button */}
                    <button
                        onClick={() => setSelectedOrder(null)}
                        className="absolute top-3  right-3 text-gray-500 hover:text-black text-xl"
                    >
                        ✕
                    </button>

                    {/* Header */}
                    <div className="flex items-center mt-4 gap-4 pb-3">
                        <div className="bg-orange-500 p-3 rounded-full text-white text-3xl">
                            <img src={vector} alt="User" className="" />
                        </div>

                        <div>
                            <p className="text-xl text-[#000000] font-semibold">
                                Order #{selectedOrder.orderId}
                            </p>

                            <p className="text-[#00000099] text-sm">
                                {
                                    selectedOrder.services?.reduce(
                                        (sum, cat) =>
                                            sum +
                                            (cat.products?.reduce((pSum, p) => pSum + p.quantity, 0) || 0),
                                        0
                                    )
                                } items • {new Date(selectedOrder.createdAt).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                        </div>

                        <p className="ml-auto text-green-600 font-bold text-xl">
                            ₹{selectedOrder.paymentSummary?.finalAmount}
                        </p>
                    </div>

                    {/* Items List */}
                    <div className="mt-4 space-y-3">
                        {selectedOrder.services?.map((category, i) =>
                            category.products?.map((prod, idx) => (
                                <div key={idx} className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <img src={veg} alt="veg" className="w-5 h-5" />
                                        <p className="font-medium text-[#000000]">
                                            {prod.productName} ×{prod.quantity}
                                        </p>
                                    </div>
                                    <p className="text-gray-600">₹{prod.price}</p>
                                </div>
                            ))
                        )}
                    </div>

                </div>
            </div>
        )}


    </>
};

export default Transactions;