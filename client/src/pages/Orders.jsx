
import { Icon } from "@iconify/react";
import React, { useEffect, useRef, useState } from "react";
import vector from "/vector.png";
import veg from "/veg.png";
import { useLocation, useOutletContext } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useConfirmRejectOrderMutation, useGetOrderByShopIdQuery, useOrderAcceptedMutation } from "../redux/apis/orderApi";
import { useSelector } from "react-redux";

const Orders = () => {
    const filterRef = useRef(null);

    const navigate = useNavigate();
    const location = useLocation();
    const shopId = useSelector((state) => state.auth.shopId);

    const { data, isLoading, isError } = useGetOrderByShopIdQuery(shopId, { skip: !shopId });
    const [orderAccepted] = useOrderAcceptedMutation();
    const [confirmRejectOrder] = useConfirmRejectOrderMutation();

    const [localOrders, setLocalOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [activeTab, setActiveTab] = useState("All");
    const [showFilter, setShowFilter] = useState(false);
    const { searchTerm } = useOutletContext();
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

    useEffect(() => {
        if (data?.orders) setLocalOrders(data.orders);
    }, [data]);

    // Accept order → Ready
    const handleAcceptOrder = async (orderId) => {
        try {

            await orderAccepted({ id: orderId, orderStatus: "orderAccepted" }).unwrap();
            const updatedOrders = localOrders.map((order) =>
                order._id === orderId ? { ...order, orderStatus: "orderAccepted" } : order
            );

            setLocalOrders(updatedOrders);
            navigate("/orders?tab=Ongoing");
        } catch (err) {
            console.error("Error accepting order:", err);
            alert("Failed to accept order.");
        }
    };


    // Reject order
    const handleRejectOrder = async (orderId) => {
        const confirmReject = window.confirm("Are you sure you want to reject this order?");
        if (!confirmReject) return;

        try {
            await confirmRejectOrder({ id: orderId, orderStatus: "rejected" }).unwrap();
            const updatedOrders = localOrders.map((order) =>
                order._id === orderId ? { ...order, orderStatus: "rejected" } : order
            );
            setLocalOrders(updatedOrders);
            navigate("/orders?tab=Rejected");
        } catch (err) {
            console.error("Error rejecting order:", err);
            alert("Failed to reject order.");
        }
    };
    const handleMarkAsReady = async (orderId) => {
        try {
            await confirmRejectOrder({
                id: orderId,
                orderStatus: "orderReady"
            }).unwrap();

            const updatedOrders = localOrders.map(order =>
                order._id === orderId ? { ...order, orderStatus: "orderReady" } : order
            );

            setLocalOrders(updatedOrders);
            navigate("/orders?tab=Ready");

        } catch (err) {
            console.error("Failed to mark as ready:", err);
            alert("Failed to mark order as ready.");
        }
    };


    const handleDeliveryPickedUp = async (orderId) => {
        try {
            await confirmRejectOrder({
                id: orderId,

                orderStatus: "pickup"
            }).unwrap();

            const updatedOrders = localOrders.map((order) =>
                order._id === orderId ? { ...order, orderStatus: "pickup" } : order
            );

            setLocalOrders(updatedOrders);

            navigate("/orders?tab=OutForDelivery");

        } catch (err) {
            console.error("Failed to mark order as picked up:", err);
            alert("Failed to mark order as picked up.");
        }
    };



    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get("tab") || "All";

        switch (tab) {
            case "Requests":
                setActiveTab(`Requests (${localOrders.filter(o => o.orderStatus === 'pending').length})`);
                break;

            case "Ongoing":
                setActiveTab(`Ongoing (${localOrders.filter(o => o.orderStatus === 'orderAccepted').length})`);
                break;

            case "Ready":
                setActiveTab(`Ready (${localOrders.filter(o => o.orderStatus === 'orderReady').length})`);
                break;
            case "OutForDelivery":
                setActiveTab(`OutForDelivery (${localOrders.filter(o => o.orderStatus === 'pickup').length})`);
                break;

            case "Completed":
                setActiveTab(`Completed (${localOrders.filter(o => o.orderStatus === 'delivered').length})`);
                break;

            case "Rejected":
                setActiveTab(`Rejected (${localOrders.filter(o => o.orderStatus === 'rejected').length})`);
                break;

            default:
                setActiveTab(`All Orders (${localOrders.length})`);
        }
    }, [location, localOrders]);


    // Tabs
    const tabs = [
        `Requests (${localOrders.filter(o => o.orderStatus === 'placeorder').length})`,
        `Ongoing (${localOrders.filter(o => o.orderStatus === 'orderAccepted').length})`,
        `Ready (${localOrders.filter(o => o.orderStatus === 'orderReady').length})`,
        `OutForDelivery (${localOrders.filter(o => o.orderStatus === 'pickup').length})`,
        `Completed (${localOrders.filter(o => o.orderStatus === 'delivered').length})`,
        `Rejected (${localOrders.filter(o => o.orderStatus === 'rejected').length})`,
        `All Orders (${localOrders.length})`,
    ];

    // Filter orders
    const filteredOrders = localOrders?.filter(order => {
        const term = searchTerm?.toLowerCase() || "";
        const customer = order.addressId?.name?.toLowerCase() || "";
        const contact = order.addressId?.contactNo?.toLowerCase() || "";
        const address = order.addressId?.location?.toLowerCase() || "";
        const status = order.orderStatus?.toLowerCase() || "";

        const matchesSearch =
            customer.includes(term) ||
            contact.includes(term) ||
            address.includes(term) ||
            status.includes(term);

        if (activeTab.includes("Requests")) return matchesSearch && order.orderStatus === "placeorder";
        if (activeTab.includes("Ongoing")) return matchesSearch && order.orderStatus === "orderAccepted";
        if (activeTab.includes("Ready")) return matchesSearch && order.orderStatus === "orderReady";
        if (activeTab.includes("OutForDelivery")) return matchesSearch && order.orderStatus === "pickup";
        if (activeTab.includes("Completed")) return matchesSearch && order.orderStatus === "delivered";

        if (activeTab.includes("Rejected")) return matchesSearch && order.orderStatus === "rejected";

        return matchesSearch;
    }) || [];

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

                    <div className="h-6 w-20 bg-slate-300 animate-pulse rounded mr-4 md:mr-44"></div>
                </div>

                {/* Table Skeleton */}
                <div className="bg-white mt-6 shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-4 md:p-6 min-h-[700px]">
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


    // if (isError) return <p className="text-center mt-52 text-red-500">Failed to load orders.</p>;
    // if (!data?.orders?.length) return <p className="text-center mt-52 text-gray-600">No orders found.</p>;

    return <>
        {/* <pre className="text-black">
                Total Orders: {data?.orders?.length}
            </pre> */}

        {/* <pre className="text-black mt-15">{JSON.stringify(data, null, 2)}</pre> */}
        <div className="p-2 md:p-6 bg-[#F5F5F5] mt-20 h-[calc(100vh-80px)] flex flex-col overflow-hidden transition-all duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full text-[17px] text-[#808080] relative gap-4 md:gap-0">

                {/* LEFT SIDE - Tabs */}
                <div className="flex gap-6 md:gap-15 items-center whitespace-nowrap overflow-x-auto lg:overflow-visible w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
                    {tabs.map(tab => (
                        <span
                            key={tab}
                            onClick={() => navigate(`/orders?tab=${tab.split(" ")[0]}`)}
                            className={`cursor-pointer px-4 pb-3 transition-all font-medium text-[107%] duration-200 ${activeTab.startsWith(tab.split(" ")[0]) ? "text-[#FF9129]" : "hover:text-[#FF9129]"
                                }`}
                        >
                            {tab}
                        </span>
                    ))}
                </div>

                {/* RIGHT SIDE - Filter */}
                {/* <div
                    className="flex items-center gap-2 md:mr-44 mb-2 md:ml-16 font-semibold cursor-pointer self-end md:self-auto"
                    onClick={() => setShowFilter(!showFilter)}
                >

                    <span className="text-[#000000]  icon-Poppins">filter</span>
                    <Icon
                        icon="basil:filter-outline"
                        width="26"
                        height="26"
                        className="text-black"
                    />
                </div> */}

            </div>
            {/* {showFilter && (
                <div ref={filterRef} className="absolute right-2 md:right-40 mt-2 md:-mt-10 bg-white shadow-xl p-0 z-50 w-40">
                    <div className="flex flex-col gap-0 text-black text-[13px] font-medium">
                        <button className="hover:bg-gray-100 p-1 rounded">Today</button>
                        <button className="hover:bg-gray-100 p-1 rounded">Last 7 days</button>
                        <button className="hover:bg-gray-100 p-1 rounded">3 Months</button>
                    </div>
                </div>
            )} */}



            {/* Table / Card View */}
            <div className="bg-white mt-6 shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-4 md:p-6 flex-1 flex flex-col overflow-hidden">
                <div className="overflow-y-auto mt-5 flex-1">
                    <table className="hidden lg:table w-full border-collapse text-left text-gray-800">
                        <thead className="bg-gray-100 h-16 text-[15px] dm-sans font-bold text-[#000000] sticky top-0 z-10">
                            <tr>
                                <th className="py-3 px-6 text-[14px] font-medium">Customer Name</th>
                                <th className="py-3 px-6 font-medium">Total Items</th>
                                <th className="py-3 px-6 font-medium">Contact No</th>
                                <th className="py-3 px-9 font-medium">Address</th>
                                <th className="py-3 px-6 font-medium">Prep Time</th>
                                <th className="py-3 px-6 font-medium">Price</th>
                                <th className="py-3 px-6 font-medium">Date & Time</th>
                                <th className="py-3 px-6 font-medium text-center">{activeTab.startsWith("Requests") ? "Action" : "Status"}</th>
                            </tr>
                        </thead>

                        <tbody className="text-[15px]">
                            {filteredOrders.map((order, index) => {
                                const customer = order.addressId?.name || "—";
                                const contact = order.addressId?.contactNo || "—";
                                const address = order.addressId?.location || "—";
                                const totalItems = order.services?.reduce((sum, cat) =>
                                    sum + (cat.products?.reduce((pSum, p) => pSum + p.quantity, 0) || 0), 0);
                                const price = order.paymentSummary?.finalAmount || 0;
                                const created = new Date(order.createdAt).toLocaleString();
                                const status = order.orderStatus || "Pending";

                                return (
                                    <tr key={index} className="border-t h-20 font-bold text-[#000000] border-gray-200 hover:bg-gray-50 transition">
                                        <td className="py-3 px-6">{customer}</td>
                                        <td className="py-3 px-6 flex mt-3 items-center gap-6">
                                            {totalItems}
                                            <button onClick={() => setSelectedOrder(order)} className="text-[#0046AF] underline mt-1 text-[14px] hover:text-blue-800">View</button>
                                        </td>
                                        <td className="py-3 px-6">{contact}</td>
                                        <td className="py-3 px-6 whitespace-normal break-words max-w-[200px] leading-snug">{address}</td>
                                        <td className="py-3 px-6">15–20 Min</td>
                                        <td className="py-3 px-6">₹{price}</td>
                                        <td className="py-3 px-6">
                                            <div className="flex flex-col items-start">
                                                <span>{created.split(",")[0]}</span>
                                                <span className="text-[#000000] text-[13px]">{created.split(",")[1]}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-6 text-center">
                                            {activeTab.startsWith("Requests") ? (
                                                <div className="flex justify-center gap-4">
                                                    <button className="p-2" onClick={() => handleAcceptOrder(order._id)}>
                                                        <Icon icon="mdi:check-circle" className="text-green-600 text-2xl" />
                                                    </button>
                                                    <button className="p-2" onClick={() => handleRejectOrder(order._id)}>
                                                        <Icon icon="mdi:close-circle" className="text-red-600 text-2xl" />
                                                    </button>
                                                </div>
                                            ) : activeTab.startsWith("Ongoing") ? (
                                                <button
                                                    onClick={() => handleMarkAsReady(order._id)}
                                                    className="bg-[#FF9129] hover:bg-[#e57f22] text-white px-4 py-2 rounded-lg transition"
                                                >
                                                    Mark As Ready
                                                </button>
                                            )
                                                : activeTab.startsWith("Ready") ? (
                                                    <button
                                                        onClick={() => handleDeliveryPickedUp(order._id)}
                                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                                                    >
                                                        Delivery Picked Up
                                                    </button>
                                                ) : (
                                                    <span
                                                        className={`px-4 py-1 rounded-md text-sm font-semibold ${status === "orderReady"
                                                            ? "text-[#19700B]"
                                                            : status === "rejected"
                                                                ? "text-red-600"
                                                                : "text-gray-600"
                                                            }`}
                                                    >
                                                        {status}
                                                    </span>
                                                )}
                                        </td>

                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    <div className="lg:hidden flex flex-col gap-4">
                        {filteredOrders.map((order, index) => {
                            const customer = order.addressId?.name || "—";
                            const contact = order.addressId?.contactNo || "—";
                            const address = order.addressId?.location || "—";
                            const totalItems = order.services?.reduce((sum, cat) =>
                                sum + (cat.products?.reduce((pSum, p) => pSum + p.quantity, 0) || 0), 0);
                            const price = order.paymentSummary?.finalAmount || 0;
                            const created = new Date(order.createdAt).toLocaleString();
                            const status = order.orderStatus || "Pending";

                            return (
                                <div key={index} className="bg-white border rounded-lg p-3 shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-bold text-lg text-black">{customer}</h3>
                                            <p className="text-sm text-black">{created}</p>
                                        </div>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${status === "orderReady"
                                                ? "bg-green-100 text-green-700"
                                                : status === "rejected"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-gray-100 text-gray-700"
                                                }`}
                                        >
                                            {status}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-sm mb-3 text-black">
                                        <div>
                                            <p className="text-black font-medium">Contact:</p>
                                            <p>{contact}</p>
                                        </div>
                                        <div>
                                            <p className="text-black font-medium">Price:</p>
                                            <p className="font-semibold">₹{price}</p>
                                        </div>
                                        <div>
                                            <p className="text-black font-medium">Items:</p>
                                            <div className="flex items-center gap-2">
                                                <span>{totalItems}</span>
                                                <button onClick={() => setSelectedOrder(order)} className="text-[#0046AF] underline text-xs">View</button>
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-black font-medium">Address:</p>
                                            <p className="truncate">{address}</p>
                                        </div>
                                    </div>

                                    <div className="mt-3 pt-3 border-t flex justify-end">
                                        {activeTab.startsWith("Requests") ? (
                                            <div className="flex gap-3">
                                                <button className="p-2 bg-green-50 rounded-full" onClick={() => handleAcceptOrder(order._id)}>
                                                    <Icon icon="mdi:check" className="text-green-600 text-xl" />
                                                </button>
                                                <button className="p-2 bg-red-50 rounded-full" onClick={() => handleRejectOrder(order._id)}>
                                                    <Icon icon="mdi:close" className="text-red-600 text-xl" />
                                                </button>
                                            </div>
                                        ) : activeTab.startsWith("Ongoing") ? (
                                            <button
                                                onClick={() => handleMarkAsReady(order._id)}
                                                className="bg-[#FF9129] text-white px-4 py-2 rounded-lg text-sm w-full"
                                            >
                                                Mark As Ready
                                            </button>
                                        ) : activeTab.startsWith("Ready") ? (
                                            <button
                                                onClick={() => handleDeliveryPickedUp(order._id)}
                                                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm w-full"
                                            >
                                                Delivery Picked Up
                                            </button>
                                        ) : null}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

        </div>

        {selectedOrder && (
            <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
                <div className="bg-white w-[95%] max-w-lg h-auto max-h-[80vh] overflow-y-auto rounded-2xl p-5 relative shadow-xl">

                    <button
                        onClick={() => setSelectedOrder(null)}
                        className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
                    >
                        ✕
                    </button>

                    <div className="flex items-center gap-4  pb-3">
                        <div className="bg-orange-500 p-3 rounded-full text-white text-3xl">
                            <img src={vector} alt="User" className="" />
                        </div>

                        <div>
                            <p className="text-xl text-[#000000] font-semibold">Order #{selectedOrder.orderId}</p>
                            <p className="text-[#00000099] text-sm">
                                {selectedOrder.services?.reduce(
                                    (sum, cat) =>
                                        sum +
                                        (cat.products?.reduce((pSum, p) => pSum + p.quantity, 0) || 0),
                                    0
                                )} items • {new Date(selectedOrder.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
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
                                        <p className="font-medium text-[#000000]">{prod.productName} ×{prod.quantity}</p>
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

export default Orders;


