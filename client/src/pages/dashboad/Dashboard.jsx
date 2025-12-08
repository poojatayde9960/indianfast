import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { useNavigate, useOutletContext } from "react-router-dom";
import NewOrderRequests from "./NewOrderRequests";
import { useGetOrderByShopIdQuery } from "../../redux/apis/orderApi";
import { useDispatch, useSelector } from "react-redux";
import { useGetShopStatusQuery, useToggleAvailabilityMutation } from "../../redux/apis/attendance";
import { setActive, setCheckInTime } from "../../redux/slices/vendorSlice";
import { IoIosArrowForward } from "react-icons/io";

const Dashboard = () => {
    const [duration, setDuration] = useState("00 : 00 : 00");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isActive = false, shopId = null } = useSelector(state => state.auth || {});

    const [toggleAvailability, { isLoading: isToggling }] = useToggleAvailabilityMutation();
    const { data: ShopStatusData, isLoading: isStatusLoading } = useGetShopStatusQuery(shopId, {
        skip: !shopId
    });

    const { data, isLoading } = useGetOrderByShopIdQuery(shopId, { skip: !shopId });
    const { setPageTitle } = useOutletContext();

    const parseTotalWorkingHours = (str) => {
        if (!str || str === "0.00.00") return 0;
        const [h, m, s] = str.split(".").map(Number);
        return (h || 0) * 3600 + (m || 0) * 60 + (s || 0);
    };

    const refreshStatusAndTimer = async () => {
        if (!ShopStatusData) return;

        const isOnline = ShopStatusData.status === "Checked In";
        dispatch(setActive(isOnline));

        if (isOnline && ShopStatusData.totalWorkingHours) {
            const totalSeconds = parseTotalWorkingHours(ShopStatusData.totalWorkingHours);
            setElapsedSeconds(totalSeconds);
        } else {
            setElapsedSeconds(0);
            setDuration("00 : 00 : 00");
        }
    };


    useEffect(() => {
        if (ShopStatusData) refreshStatusAndTimer();
    }, [ShopStatusData]);

    const handleToggleAvailability = async () => {
        if (!shopId || isToggling) return;

        try {
            const previousStatus = isActive;
            dispatch(setActive(!previousStatus)); // 

            const res = await toggleAvailability({ ShopId: shopId }).unwrap();

            const newStatus = res.status === "Checked In";
            dispatch(setActive(newStatus)); // 

            if (newStatus && res.totalWorkingHours) {
                const totalSeconds = parseTotalWorkingHours(res.totalWorkingHours);
                setElapsedSeconds(totalSeconds);
            } else {
                setElapsedSeconds(0);
                setDuration("00 : 00 : 00");
            }

        } catch (err) {
            console.error("Toggle failed", err);
            dispatch(setActive(!isActive));
            alert("Failed to change availability. Please try again.");
        }
    };

    const [elapsedSeconds, setElapsedSeconds] = useState(0);

    useEffect(() => {
        if (!isActive) {
            setDuration("00 : 00 : 00");
            return;
        }

        const interval = setInterval(() => {
            setElapsedSeconds(prev => {
                const total = prev + 1;
                const h = String(Math.floor(total / 3600)).padStart(2, "0");
                const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
                const s = String(total % 60).padStart(2, "0");
                setDuration(`${h} : ${m} : ${s}`);
                return total;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isActive]);

    // Orders
    const orders = data?.orders || [];
    const stats = data?.stats || {};
    const deliveredOrders = orders.filter(o => o.orderStatus === "delivered").length;

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


        <div className="p-4 sm:p-5 md:p-6 bg-[#F5F5F5] mt-20 min-h-[calc(100vh-80px)] md:h-[calc(100vh-80px)] overflow-y-auto transition-all duration-500">
            {/* <div className="p-4 sm:p-5 md:p-6 bg-[#F5F5F5] mt-20 min-h-[calc(100vh-80px)] overflow-y-auto transition-all duration-500"> */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-12 mb-8 w-full">

                {/* Total Orders */}
                <div onClick={() => navigate("/orders")} className="cursor-pointer bg-white rounded-3xl h-36 shadow-[0_4px_20px_0_rgba(0,0,0,0.1)] p-5 flex flex-col justify-between hover:shadow-[0_8px_25px_rgba(0,0,0,0.2)] transition-shadow duration-300">
                    <div className="flex justify-between items-center">
                        <h3 className="text-[#1E1E1E] text-[122%] font-Poppins mb-1">Total Orders</h3>
                        <div className="w-11 h-11 flex items-center justify-center rounded-full bg-[#3F922426]">
                            <Icon icon="lets-icons:order-light" className="text-[#EF9C01] w-7 h-7 font-bold" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-3xl dm-sans mb-3 font-bold text-gray-900">{stats.totalOrders || 0}</h2>
                        <p className="text-sm text-[#808080] font-Poppins">All orders received</p>
                    </div>
                </div>

                {/* Delivered Orders */}
                <div onClick={() => navigate("/orders?tab=Completed")} className="bg-white rounded-3xl h-36 shadow-[0_4px_20px_0_rgba(0,0,0,0.1)] p-5 flex flex-col justify-between hover:shadow-[0_8px_25px_rgba(0,0,0,0.2)] transition-shadow duration-300">
                    <div className="flex justify-between items-center">
                        <h3 className="text-[#1E1E1E] text-[122%] font-Poppins mb-1">Delivered Orders</h3>
                        <div className="w-11 h-11 flex items-center justify-center rounded-full bg-[#3F922426]">
                            <Icon icon="mdi:truck-delivery-outline" className="text-[#EF9C01] w-7 h-7 font-bold" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-3xl dm-sans mb-3 font-bold text-gray-900">{deliveredOrders}</h2>
                        <p className="text-sm text-[#808080] font-Poppins">Orders successfully delivered</p>
                    </div>
                </div>

                {/* Revenue */}
                <div onClick={() => { navigate("/transactions"); setPageTitle("Transactions"); }} className="bg-white rounded-3xl h-36 shadow-[0_4px_20px_0_rgba(0,0,0,0.1)] p-5 flex flex-col justify-between hover:shadow-[0_8px_25px_rgba(0,0,0,0.2)] transition-shadow duration-300">
                    <div className="flex justify-between items-center">
                        <h3 className="text-[#1E1E1E] text-[122%] font-Poppins mb-1">Total Revenue</h3>
                        <div className="w-11 h-11 flex items-center justify-center rounded-full bg-[#3F922426]">
                            <Icon icon="pepicons-pencil:money-note-circle" className="text-[#EF9C01] w-7 h-7 font-bold" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-3xl dm-sans mb-3 font-bold text-gray-900">₹ {stats.totalVendorAmount?.toFixed(2) || "0.00"}</h2>
                        <p className="text-sm text-[#808080] font-Poppins">Vendor earnings</p>
                    </div>
                </div>

                <div className={`w-full sm:w-[105%] md:w-[110%] rounded-xl p-6 flex items-center justify-between transition-all duration-300
                    ${isActive ? "bg-[#F0FFF4] text-[#000000] border border-[#34C759]" : "bg-white shadow-[0_4px_20px_rgba(0,0,0,0.1)]"} `}>
                    <div>
                        <h2 className="text-xl font-semibold dm-sans text-[#000000] transition-all duration-300">
                            {isActive ? "You're Online" : "You're Offline"}
                        </h2>
                        <p className={`text-sm mt-1 transition-all duration-300 ${isActive ? "text-[#1E1E1E]" : "text-gray-500"}`}>
                            {isActive ? "Ready to accept orders" : "Turn on to start receiving orders"}
                        </p>
                    </div>
                    <button
                        onClick={handleToggleAvailability}
                        disabled={isToggling || !shopId}
                        className={`relative w-[55px] h-[28px] rounded-full flex items-center justify-center transition-all duration-300
                            ${isActive ? "bg-black" : "bg-[#D9D9D9]"} 
                            ${isToggling ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                            ${!shopId ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {isToggling ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                            </svg>
                        ) : (
                            <span className={`absolute left-[3px] w-[22px] h-[22px] rounded-full transition-all duration-300
                                ${isActive ? "translate-x-[27px] bg-[#FF6F00]" : "translate-x-0 bg-white"}`}></span>
                        )}
                    </button>
                </div>

                <div className="bg-white w-full sm:w-[105%] md:w-[110%] rounded-xl sm:ml-1 shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-6 flex flex-col items-center justify-center">
                    <h1 className="text-3xl font-bold dm-sans text-black">{duration}</h1>
                    <div className="flex items-center gap-2">
                        <p className="text-gray-600 mt-2 dm-sans">
                            {new Date().toLocaleDateString()}
                        </p>
                        <div onClick={() => navigate("/attendanceTimer")} className="cursor-pointer">
                            <IoIosArrowForward className="h-8 w-8 mt-1 text-black" />
                        </div>
                    </div>
                </div>
            </div>

            <NewOrderRequests />
        </div>
    </>
};

export default Dashboard;