import React from 'react'
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import vector from "/vector.png";
import veg from "/veg.png";
import {
    useConfirmRejectOrderMutation,
    useGetOrderByShopIdQuery,
    useOrderAcceptedMutation
} from '../../redux/apis/orderApi';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const NewOrderRequests = () => {
    const { shopId, isActive } = useSelector((state) => state.auth);
    const { data, isLoading } = useGetOrderByShopIdQuery(
        shopId,
        { skip: !shopId, refetchOnMountOrArgChange: true }
    );

    const [orderAccepted] = useOrderAcceptedMutation();
    const [confirmRejectOrder] = useConfirmRejectOrderMutation();
    const navigate = useNavigate();

    // ACCEPT
    const handleAcceptOrder = async (orderId) => {
        try {
            await orderAccepted({
                id: orderId,
                orderStatus: "orderAccepted",
            }).unwrap();
            toast.success("Order Accepted!");
            setTimeout(() => {
                navigate("/orders?tab=Ongoing");
            }, 500);

            // navigate("/orders?tab=Ongoing");
        } catch (error) {
            toast.error("Failed to accept order.");
        }
    };

    // REJECT
    const handleRejectOrder = async (orderId) => {
        const confirm = window.confirm("Are you sure you want to reject this order?");
        if (!confirm) return;

        try {
            await confirmRejectOrder({
                id: orderId,
                orderStatus: "rejected",
            }).unwrap();

            toast.success("Order rejected successfully!");
            setTimeout(() => {
                navigate("/orders?tab=Rejected");
            }, 500);
            // navigate("/orders?tab=Rejected");
        } catch (error) {
            toast.error("Failed to reject order.");
        }
    };

    const pendingOrders = data?.orders?.filter(
        order => order.orderStatus === "placeorder"
    ) || [];

    return <>

        {/* <pre className='text-black'>{JSON.stringyify(data, null, 2)}</pre> */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* LEFT SIDE – New Requests */}
            <div className="lg:col-span-2 w-full">
                <h3 className="text-[#000000] text-xl mb-4 sm:mb-7 px-2 sm:px-0">
                    New Order Requests
                </h3>

                {!isActive ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <h4 className="text-red-700 font-semibold text-lg mb-2">You are currently Offline</h4>
                        <p className="text-red-600">Please go online to receive and accept new orders.</p>
                    </div>
                ) : pendingOrders.length > 0 ? (
                    pendingOrders.slice(0, 2).map((order, index) => (
                        <div
                            key={order._id || index}
                            className="relative bg-white rounded-[19px] shadow-[0_6px_30px_rgba(0,0,0,0.25)] 
                                px-4 sm:px-5 pt-6 pb-4 mb-7 w-full
                                flex flex-col sm:flex-row justify-between items-start"
                        >
                            {/* Prep Time */}
                            {(() => {
                                const prep =
                                    order?.services?.[0]?.products?.[0]?.preparationTime
                                        ? `Prep Time: ${order.services[0].products[0].preparationTime} mins`
                                        : "Prep Time: 15 mins";

                                return (
                                    <div className="absolute -top-[0px] right-2 sm:right-[320px] bg-[#CBE7FF] 
            rounded-bl-[10px] rounded-tr-[10px] px-[12px] sm:px-[16px] 
            py-[6px] text-[#000000] text-sm sm:text-lg font-normal">
                                        {prep}
                                    </div>
                                );
                            })()}


                            {/* LEFT */}
                            <div className="w-full sm:w-auto">
                                <div className="flex gap-4 items-center">
                                    <div className="w-[47px] h-[47px] rounded-full flex items-center justify-center 
                                        bg-gradient-to-b from-[#FF6F00] to-[#FF9933]">
                                        <img src={vector} alt="food icon" className="w-[18px] h-[20px]" />
                                    </div>

                                    <div>
                                        <h4 className="text-[16px] sm:text-[18px] sm:mt-3 text-[#808080]">
                                            Order Request From
                                        </h4>
                                        <span className="text-[#000000] text-[18px] sm:text-[20px] font-semibold">
                                            {order?.addressId?.name || "Unknown User"}
                                        </span>
                                    </div>
                                </div>

                                {/* Time + Items */}
                                <p className="text-[#00000099] text-[15px] sm:text-[16px] mt-2">
                                    {order.services?.[0]?.products?.length || 0} items •{" "}
                                    {new Date(order.createdAt).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>

                                {/* PRODUCT LIST */}
                                <div className="mt-3">
                                    <div className="flex items-center gap-6 overflow-x-auto pb-1 scrollbar-hide">
                                        {order.services?.[0]?.products?.map((product, pIndex) => (
                                            <div
                                                key={pIndex}
                                                className="flex items-center gap-2 flex-shrink-0 text-[#000000] font-semibold whitespace-nowrap"
                                            >
                                                <img src={veg} alt="veg" className="w-4 h-4 flex-shrink-0" />
                                                <span className="text-[15px] sm:text-[16px]">
                                                    {product.productName}{" "}
                                                    <span className="text-[#00000099] font-medium">x{product.quantity}</span>
                                                </span>
                                                <span className="text-[15px] text-[#00000099]">
                                                    ₹{product.total}/-
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT */}
                            <div className="flex flex-col items-end gap-3 mt-6 sm:mt-0 w-full sm:w-auto">

                                <span className="text-[#4CAF50]  dm-sans  font-semibold text-[16px] sm:text-[15px]">
                                    ₹{order?.paymentSummary?.finalAmount || 0}/-
                                </span>

                                {/* BUTTONS */}
                                <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 mt-4 sm:mt-20 w-full sm:w-auto">

                                    <button
                                        className="h-[40px] sm:h-[48px] w-full sm:w-[146px] rounded-[4px]
                                            font-semibold text-[#FF6F00] border border-[#FF6F00]"
                                        onClick={() => handleRejectOrder(order._id)}
                                    >
                                        Reject
                                    </button>

                                    <button
                                        className="h-[40px] sm:h-[48px] w-full sm:w-[150px] rounded-[4px]
                                            font-semibold text-white bg-gradient-to-r from-[#FF6F00] to-[#FF9933]"
                                        onClick={() => handleAcceptOrder(order._id)}
                                    >
                                        Accept
                                    </button>

                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 px-2">No new order requests.</p>
                )}
            </div>


            {/* <pre className='text-black'>{JSON.stringify(data, null, 2)}</pre> */}
            <div className="bg-white rounded-[20px] mt-4 lg:-mt-[40%] w-full lg:w-[85%] lg:ml-11 shadow-[0_4px_20px_rgba(0,0,0,0.08)] 
                p-4 sm:p-5">

                <h3 className="text-gray-700 font-semibold mb-5 sm:mb-8 text-lg sm:text-xl">
                    Recent Transactions
                </h3>

                <div className="flex justify-between items-center bg-[#D9D9D954] px-3 py-3 
                    text-[13px] sm:text-[14px] font-semibold text-[#000000B2] mb-5">
                    <p>Name</p>
                    <p>Amount</p>
                </div>

                <div className="flex flex-col gap-3 px-1 text-sm">
                    {data?.orders
                        ?.filter(order => order.orderStatus === "delivered")
                        ?.slice(0, 8)
                        ?.map((order, i) => (
                            <div key={i} className="flex justify-between items-center py-[6px] border-b border-[#D9D9D94F]">
                                <p className="text-[#000000] font-Poppins text-[110%]">
                                    {order?.addressId?.name || "Unknown"}
                                </p>

                                <p className="text-[#19700B] text-[110%] font-medium">
                                    +{order?.paymentSummary?.finalAmount || 0}
                                </p>
                            </div>
                        ))}
                </div>

                <p
                    className="text-right text-lg font-Poppins text-[#808080] hover:text-orange-500
    cursor-pointer mt-8 sm:mt-11"
                    onClick={() => navigate("/transactions")}
                >
                    View All
                </p>

            </div>
        </div>
    </>
};

export default NewOrderRequests;
