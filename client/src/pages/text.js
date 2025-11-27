// import { Icon } from "@iconify/react";
// import React, { useEffect, useState } from "react";
// import vector from "/vector.png";
// import veg from "/veg.png";
// import { useLocation, useOutletContext } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import { useConfirmRejectOrderMutation, useGetOrderByShopIdQuery, useOrderAcceptedMutation } from "../redux/apis/orderApi";
// import { useSelector } from "react-redux";

// const Orders = () => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const shopId = useSelector((state) => state.auth.shopId);

//     const { data, isLoading, isError } = useGetOrderByShopIdQuery(shopId, { skip: !shopId });
//     const [orderAccepted] = useOrderAcceptedMutation();
//     const [confirmRejectOrder] = useConfirmRejectOrderMutation();

//     const [selectedOrder, setSelectedOrder] = useState(null);
//     const [showFilter, setShowFilter] = useState(false);
//     const [activeTab, setActiveTab] = useState("All");
//     const { searchTerm } = useOutletContext();
//     const [localOrders, setLocalOrders] = useState([]);

//     useEffect(() => {
//         if (data?.orders) setLocalOrders(data.orders);
//     }, [data]);

//     // ✅ Accept order → थेट Ready
//     const handleAcceptOrder = async (orderId) => {
//         try {
//             await orderAccepted(orderId).unwrap(); // ✅ फक्त orderId
//             const updatedOrders = localOrders.map((order) =>
//                 order._id === orderId ? { ...order, orderStatus: "orderReady" } : order
//             );
//             setLocalOrders(updatedOrders);

//             const readyCount = updatedOrders.filter((o) => o.orderStatus === "orderReady").length;
//             setActiveTab(Ready(${ readyCount }));

//             navigate("/orders?tab=Ready");
//         } catch (err) {
//             console.error("Error accepting order:", err);
//             alert("Failed to accept order.");
//         }
//     };


//     // ❌ Reject order
//     const handleRejectOrder = async (orderId) => {
//         const confirmReject = window.confirm("Are you sure you want to reject this order?");
//         if (!confirmReject) return;

//         try {
//             await confirmRejectOrder({ id: orderId, orderStatus: "rejected" }).unwrap();
//             const updatedOrders = localOrders.map((order) =>
//                 order._id === orderId ? { ...order, orderStatus: "rejected" } : order
//             );
//             setLocalOrders(updatedOrders);

//             navigate("/orders?tab=Rejected");
//         } catch (err) {
//             console.error("Error rejecting order:", err);
//             alert("Failed to reject order.");
//         }
//     };

//     // ✅ Delivery Picked Up → Completed
//     // const handleDeliveryPickedUp = (orderId) => {
//     //     // local state मध्ये ऑर्डर status अपडेट करा
//     //     const updatedOrders = localOrders.map((order) =>
//     //         order._id === orderId ? { ...order, orderStatus: "delivered" } : order
//     //     );
//     //     setLocalOrders(updatedOrders);

//     //     // Delivered ऑर्डर मोजा आणि tab अपडेट करा
//     //     const deliveredCount = updatedOrders.filter((o) => o.orderStatus === "delivered").length;
//     //     setActiveTab(Completed (${deliveredCount}));

//     //     // Completed tab वर navigate करा
//     //     navigate("/orders?tab=Completed");
//     // };
//     const handleDeliveryPickedUp = (orderId) => {
//         const updatedOrders = localOrders.map((order) =>
//             order._id === orderId ? { ...order, orderStatus: "delivered" } : order
//         );
//         setLocalOrders(updatedOrders);

//         const deliveredCount = updatedOrders.filter((o) => o.orderStatus === "delivered").length;
//         setActiveTab(Completed(${ deliveredCount }));

//         navigate("/orders?tab=Completed");
//     };




//     // Tab selection from URL
//     useEffect(() => {
//         const params = new URLSearchParams(location.search);
//         const tab = params.get("tab");

//         if (tab === "Rejected") setActiveTab(Rejected(${ localOrders.filter(o => o.orderStatus === 'rejected').length }));
//         else if (tab === "Completed") setActiveTab(Completed(${ localOrders.filter(o => o.orderStatus === 'delivered').length }));
//         else if (tab === "Ready") setActiveTab(Ready(${ localOrders.filter(o => o.orderStatus === 'orderReady').length }));
//         else if (tab === "Requests") setActiveTab(Requests(${ localOrders.filter(o => o.orderStatus === 'pending').length }));
//         else setActiveTab(All Orders(${ localOrders.length }));
//     }, [location, localOrders]);


//     // Filter orders by search term and tab
//     const filteredOrders = localOrders?.filter((order) => {
//         const term = searchTerm?.toLowerCase() || "";
//         const customer = order.addressId?.name?.toLowerCase() || "";
//         const contact = order.addressId?.contactNo?.toLowerCase() || "";
//         const address = order.addressId?.location?.toLowerCase() || "";
//         const status = order.orderStatus?.toLowerCase() || "";

//         const matchesSearch =
//             customer.includes(term) ||
//             contact.includes(term) ||
//             address.includes(term) ||
//             status.includes(term);

//         if (activeTab.includes("Rejected")) return matchesSearch && order.orderStatus === "rejected";
//         else if (activeTab.includes("Requests")) return matchesSearch && order.orderStatus === "pending";
//         else if (activeTab.includes("Completed")) return matchesSearch && order.orderStatus === "delivered";
//         else if (activeTab.includes("Ready")) return matchesSearch && order.orderStatus === "orderReady";
//         else return matchesSearch;
//     }) || [];

//     const tabs = [
//         Requests(${ localOrders.filter(o => o.orderStatus === 'pending').length }),
//         All Orders(${ localOrders.length }),
//         Ready(${ localOrders.filter(o => o.orderStatus === 'orderReady').length }),
//         Completed(${ localOrders.filter(o => o.orderStatus === 'delivered').length }),
//         Rejected(${ localOrders.filter(o => o.orderStatus === 'rejected').length }),
//     ];


//     if (isLoading) return <p className="text-center mt-52">Loading orders...</p>;
//     if (isError) return <p className="text-center mt-52 text-red-500">Failed to load orders.</p>;
//     if (!data || !data.orders) return <p className="text-center mt-52 text-gray-600">No orders found.</p>;

//     return (
//         <div className="p-4 sm:p-5 md:p-6 bg-[#F5F5F5] mt-20 min-h-[calc(100vh-80px)] overflow-y-auto transition-all duration-500">

//             {/* Tabs */}
//             <div className="flex flex-wrap gap-24 text-[17px] text-[#808080] relative">
//                 {tabs.map((tab) => (
//                     <span
//                         key={tab}
//                         onClick={() => setActiveTab(tab)}
//                         className={`cursor-pointer pb-3 transition-all font-medium text-[107%] duration-200 ${activeTab === tab ? "text-[#FF9129]" : "hover:text-[#FF9129]"
//                             }`}
//                     >
//                         {tab}
//                     </span>
//                 ))}

//                 {/* Filter */}
//                 <div
//                     className="flex items-center gap-2 cursor-pointer hover:text-[#FF9129] transition ml-5 relative"
//                     onClick={() => setShowFilter(!showFilter)}
//                 >
//                     <span className="mb-2 mr-3 text-[110%] text-black font-medium">Filter</span>
//                     <Icon icon="mdi:filter-outline" className="text-[220%] font-medium text-black " />

//                     {showFilter && (
//                         <div className="absolute top-0 right-0 bg-white shadow-sm w-[140px] h-[86px] flex flex-col justify-evenly items-center text-black font-dm text-[15px] z-50">
//                             <span className="cursor-pointer ml-14 hover:text-[#FF9129] transition">Today</span>
//                             <span className="cursor-pointer ml-7 hover:text-[#FF9129] transition">Last 7 days</span>
//                             <span className="cursor-pointer ml-9 hover:text-[#FF9129] transition">3 Months</span>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* Table */}
//             <div className="bg-white mt-6 shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-4 md:p-6 min-h-[700px]">
//                 <div className="overflow-hidden mt-5">
//                     <table className="w-full border-collapse text-left text-gray-800">
//                         <thead className="bg-gray-100 h-16 text-[15px] dm-sans font-bold text-[#000000]">
//                             <tr>
//                                 <th className="py-3 px-6 text-[14px] font-medium">Customer Name</th>
//                                 <th className="py-3 px-6 font-medium">Total Items</th>
//                                 <th className="py-3 px-6 font-medium">Contact No</th>
//                                 <th className="py-3 px-9 font-medium">Address</th>
//                                 <th className="py-3 px-6 font-medium">Prep Time</th>
//                                 <th className="py-3 px-6 font-medium">Price</th>
//                                 <th className="py-3 px-6 font-medium">Date & Time</th>
//                                 <th className="py-3 px-6 font-medium text-center">{activeTab === "Requests (10)" ? "Action" : "Status"}</th>
//                             </tr>
//                         </thead>

//                         <tbody className="text-[15px]">
//                             {filteredOrders.map((order, index) => {
//                                 const customer = order.addressId?.name || "—";
//                                 const contact = order.addressId?.contactNo || "—";
//                                 const address = order.addressId?.location || "—";
//                                 const totalItems = order.services?.reduce(
//                                     (sum, cat) =>
//                                         sum + (cat.products?.reduce((pSum, p) => pSum + p.quantity, 0) || 0),
//                                     0
//                                 );
//                                 const price = order.paymentSummary?.finalAmount || 0;
//                                 const created = new Date(order.createdAt).toLocaleString();
//                                 const status = order.orderStatus || "Pending";

//                                 return (
//                                     <tr key={index} className="border-t h-20 font-bold text-[#000000] border-gray-200 hover:bg-gray-50 transition">
//                                         <td className="py-3 px-6">{customer}</td>
//                                         <td className="py-3 px-6 flex mt-3 items-center gap-6">
//                                             {totalItems}
//                                             <button onClick={() => setSelectedOrder(order)} className="text-[#0046AF] underline mt-1 text-[14px] hover:text-blue-800">View</button>
//                                         </td>
//                                         <td className="py-3 px-6">{contact}</td>
//                                         <td className="py-3 px-6 whitespace-normal break-words max-w-[200px] leading-snug">{address}</td>
//                                         <td className="py-3 px-6">15–20 Min</td>
//                                         <td className="py-3 px-6">₹{price}</td>
//                                         <td className="py-3 px-6">
//                                             <div className="flex flex-col items-start">
//                                                 <span>{created.split(",")[0]}</span>
//                                                 <span className="text-[#000000] text-[13px]">{created.split(",")[1]}</span>
//                                             </div>
//                                         </td>
//                                         <td className="py-3 px-6 text-center">
//                                             {activeTab.startsWith("Requests") ? (
//                                                 <div className="flex justify-center gap-4">
//                                                     <button className="p-2 rounded-full transition" onClick={() => handleAcceptOrder(order._id)}>
//                                                         <Icon icon="mdi:check-circle" className="text-green-600 text-2xl" />
//                                                     </button>
//                                                     <button className="p-2 rounded-full transition" onClick={() => handleRejectOrder(order._id)}>
//                                                         <Icon icon="mdi:close-circle" className="text-red-600 text-2xl" />
//                                                     </button>
//                                                 </div>
//                                             ) : activeTab.startsWith("Ready") ? (
//                                                 <button onClick={() => handleDeliveryPickedUp(order._id)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition">
//                                                     Delivery Picked Up
//                                                 </button>
//                                             ) : (
//                                                 <span className={px - 4 py-1 rounded-md text-sm font-semibold ${status === "orderReady" ? "text-[#19700B]" : status === "rejected" ? "text-red-600" : "text-gray-600"}}>
//                                             {status}
//                                         </span>
//                                             )}
//                                     </td>

//                                     </tr>
//                         );
//                             })}
//                     </tbody>
//                 </table>
//             </div>
//         </div>

//             {/* Order Details Modal */ }
//     {
//         selectedOrder && (
//             <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
//                 <div className="bg-[#FCF7F7] shadow w-[593px] rounded-[14.42px] p-6 relative">
//                     <button onClick={() => setSelectedOrder(null)} className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl">✕</button>

//                     <div className="flex items-center gap-4 mb-4">
//                         <div className="w-[67px] h-[67px] rounded-full flex items-center justify-center bg-gradient-to-b from-[#FF6F00] to-[#FF9933]">
//                             <img src={vector} alt="food icon" className="w-[18.5px] h-[21.3px]" />
//                         </div>
//                         <div className="flex-1">
//                             <h2 className="font-medium text-3xl text-black">Order #{selectedOrder._id.slice(-4)}</h2>
//                             <p className="text-gray-500 text-xl">
//                                 {selectedOrder.services?.reduce(
//                                     (sum, cat) => sum + cat.products?.reduce((pSum, p) => pSum + p.quantity, 0) || 0,
//                                     0
//                                 )} items • {new Date(selectedOrder.createdAt).toLocaleString()}
//                             </p>
//                         </div>
//                         <span className="text-[#4CAF50] mt-8 font-bold text-3xl">₹{selectedOrder.paymentSummary?.finalAmount}/-</span>
//                     </div>

//                     <div className="space-y-3 mt-6">
//                         {selectedOrder.services?.map((cat, i) =>
//                             cat.products?.map((p, j) => (
//                                 <div key={${i}- ${ j }} className="flex justify-between items-center">
//                         <div className="flex items-center gap-2">
//                             {p.type === "veg" && <img src={veg} className="h-4 w-4" alt="" />}
//                             <span className="font-semibold text-[150%] text-[#000000]">{p.productName}</span>
//                             <span className="text-gray-500 text-xl">x{p.quantity}</span>
//                         </div>
//                         <span className="font-bold text-[#00000099] text-[150%]">₹{p.price}/-</span>
//                     </div>
//                     ))
//                             )}
//                 </div>
//             </div>
//                 </div >
//             )}
//         </div >
//     );
// };

// export default Orders;