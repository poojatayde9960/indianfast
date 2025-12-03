import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { useNavigate, useOutletContext } from "react-router-dom";
import NewOrderRequests from "./NewOrderRequests";
import { useGetOrderByShopIdQuery } from "../../redux/apis/orderApi";
import { useDispatch, useSelector } from "react-redux";
import { useAttendanceGetDashbordMutation, useToggleAvailabilityMutation } from "../../redux/apis/attendance";
import { setActive, setCheckInTime } from "../../redux/slices/vendorSlice";
import { IoIosArrowForward } from "react-icons/io";

const Dashboard = () => {
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [accumulatedTime, setAccumulatedTime] = useState(0);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isActive = false, checkInTime = null, shopId = null } = useSelector(
        (state) => state.auth || {}
    );
    const [toggleAvailability, { isLoading: isToggling }] = useToggleAvailabilityMutation();
    const [attendanceGetDashbord] = useAttendanceGetDashbordMutation()
    const { data, isLoading, isError, refetch } = useGetOrderByShopIdQuery(shopId, {
        skip: !shopId,
    });

    const parseIndianDateTime = (dateStr) => {
        if (!dateStr) return null;
        try {
            const [datePart, timePart] = dateStr.split(", ");
            const [day, month, year] = datePart.split("/");
            const formatted = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")} ${timePart.trim()}`;
            const date = new Date(formatted);
            return isNaN(date.getTime()) ? null : date;
        } catch (e) {
            console.error("Failed to parse date:", dateStr);
            return null;
        }
    };

    const parseDurationFormatted = (str) => {
        if (!str) return 0;
        let totalSeconds = 0;
        const hr = str.match(/(\d+)\s*hr/i);
        const min = str.match(/(\d+)\s*min/i);
        if (hr) totalSeconds += parseInt(hr[1]) * 3600;
        if (min) totalSeconds += parseInt(min[1]) * 60;
        return totalSeconds;
    };
    const orders = data?.orders || [];
    const stats = data?.stats || {
        totalOrders: 0,
        todayOrders: 0,
        totalVendorAmount: 0,
        todayVendorAmount: 0,
    };
    useEffect(() => {
        if (!shopId) return;

        const fetchDashboardStatus = async () => {
            try {
                const res = await attendanceGetDashbord({ ShopId: shopId }).unwrap();
                const data = res.result || res;

                const hasOngoing = data.currentSessionInfo?.hasOngoingSession || false;
                const isOpen = data.availabilityStatus === "Open";
                const isOnline = isOpen && hasOngoing;

                dispatch(setActive(isOnline));

                let initialSeconds = 0;
                if (isOnline && data.currentSessionInfo?.durationFormatted) {
                    initialSeconds = parseDurationFormatted(data.currentSessionInfo.durationFormatted);
                }

                setElapsedSeconds(initialSeconds);

                if (data.currentSessionInfo?.checkInTime) {
                    const parsed = parseIndianDateTime(data.currentSessionInfo.checkInTime);
                    dispatch(setCheckInTime(parsed?.toISOString() || null));
                }

            } catch (err) {
                console.error("Failed to fetch dashboard:", err);
            }
        };
        fetchDashboardStatus();
    }, [shopId, dispatch, attendanceGetDashbord]);



    const { setPageTitle } = useOutletContext();
    const handleToggleAvailability = async () => {
        if (!shopId || isToggling) return;

        const newStatus = !isActive;
        dispatch(setActive(newStatus));
        if (!isActive && !checkInTime) {
            dispatch(setCheckInTime(new Date().toISOString()));
        }

        try {
            const response = await toggleAvailability({ ShopId: shopId }).unwrap();
            const data = response.result || response;

            const actualStatus = data.availabilityStatus === "Open" || data.currentSessionInfo?.hasOngoingSession;
            const actualCheckIn = data.currentSessionInfo?.checkInTime;

            dispatch(setActive(actualStatus));
            dispatch(setCheckInTime(actualCheckIn || null));

        } catch (error) {
            console.error("Failed to toggle availability:", error);
            dispatch(setActive(!newStatus)); // revert
            if (!isActive) dispatch(setCheckInTime(null));

            alert("Failed to update availability. Please try again.");
        }
    };



    const [duration, setDuration] = useState("00 : 00 : 00");
    useEffect(() => {
        if (!isActive) {
            setDuration("00 : 00 : 00");
            return;
        }

        const interval = setInterval(() => {
            setElapsedSeconds(prev => {
                const totalSeconds = prev + 1;

                const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
                const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
                const seconds = String(totalSeconds % 60).padStart(2, "0");

                setDuration(`${hours} : ${minutes} : ${seconds}`);
                return totalSeconds;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isActive]);

    const readyOrders = orders.filter((o) => o.orderStatus === "ready" || o.orderStatus === "orderAccepted").length;
    const rejectedOrders = orders.filter((o) => o.orderStatus === "rejected").length;
    const pickupOrders = orders.filter((o) => o.orderStatus === "pickup").length;
    const deliveredOrders = orders.filter((o) => o.orderStatus === "delivered").length;

    if (isLoading) {
        return (
            <div className="p-4 sm:p-5 md:p-6 bg-[#F5F5F5] mt-20 min-h-[calc(100vh-80px)] md:h-[calc(100vh-80px)] overflow-y-auto transition-all duration-500">

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-12 mb-8">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="border border-blue-300 shadow rounded-md p-4 max-w-sm w-full mx-auto animate-pulse"
                        >
                            <div className="flex space-x-4">
                                <div className="rounded-full bg-slate-700 h-10 w-10"></div>
                                <div className="flex-1 space-y-6 py-1">
                                    <div className="h-2 bg-slate-700 rounded"></div>
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                                            <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                                        </div>
                                        <div className="h-2 bg-slate-700 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        );
    }


    return <>


        {/* <pre className="text-black mt-20">{JSON.stringify(data, null, 2)}</pre> */}

        <div className="p-4 sm:p-5 md:p-6 bg-[#F5F5F5] mt-20 min-h-[calc(100vh-80px)] md:h-[calc(100vh-80px)] overflow-y-auto transition-all duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-12 mb-8 w-full">

                <div
                    onClick={() => navigate("/orders")}
                    className="cursor-pointer bg-white rounded-3xl h-36 shadow-[0_4px_20px_0_rgba(0,0,0,0.1)] p-5 flex flex-col justify-between hover:shadow-[0_8px_25px_rgba(0,0,0,0.2)] transition-shadow duration-300"
                >
                    <div className="flex justify-between items-center">
                        <h3 className="text-[#1E1E1E] text-[122%] font-Poppins mb-1">Total Orders</h3>
                        <div className="w-11 h-11 flex items-center justify-center rounded-full bg-[#3F922426]">
                            <Icon icon="lets-icons:order-light" className="text-[#EF9C01] w-7 h-7 font-bold" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-3xl dm-sans mb-3 font-bold text-gray-900">
                            {stats.totalOrders || 0}
                        </h2>
                        <p className="text-sm text-[#808080] font-Poppins">All orders received</p>
                    </div>
                </div>

                <div onClick={() => navigate("/orders?tab=Completed")}
                    className="bg-white rounded-3xl h-36 shadow-[0_4px_20px_0_rgba(0,0,0,0.1)] p-5 flex flex-col justify-between hover:shadow-[0_8px_25px_rgba(0,0,0,0.2)] transition-shadow duration-300">
                    <div className="flex justify-between items-center">
                        <h3 className="text-[#1E1E1E] text-[122%] font-Poppins mb-1">Delivered Orders</h3>
                        <div className="w-11 h-11 flex items-center justify-center rounded-full bg-[#3F922426]">
                            <Icon icon="mdi:truck-delivery-outline" className="text-[#EF9C01] w-7 h-7 font-bold" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-3xl dm-sans mb-3 font-bold text-gray-900">
                            {deliveredOrders}
                        </h2>


                        <p className="text-sm text-[#808080] font-Poppins">Orders successfully delivered</p>
                    </div>
                </div>

                <div
                    onClick={() => {
                        navigate("/transactions");
                        setPageTitle("Transactions");
                    }}
                    className="bg-white rounded-3xl h-36 shadow-[0_4px_20px_0_rgba(0,0,0,0.1)] p-5 flex flex-col justify-between hover:shadow-[0_8px_25px_rgba(0,0,0,0.2)] transition-shadow duration-300"
                >
                    <div className="flex justify-between items-center">
                        <h3 className="text-[#1E1E1E] text-[122%] font-Poppins mb-1">Total Revenue</h3>
                        <div className="w-11 h-11 flex items-center justify-center rounded-full bg-[#3F922426]">
                            <Icon icon="pepicons-pencil:money-note-circle" className="text-[#EF9C01] w-7 h-7 font-bold" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-3xl dm-sans mb-3 font-bold text-gray-900">
                            ₹ {stats.totalVendorAmount?.toFixed(2) || "0.00"}
                        </h2>
                        <p className="text-sm text-[#808080] font-Poppins">Vendor earnings</p>
                    </div>
                </div>
                <div
                    className={`w-full sm:w-[105%] md:w-[110%] rounded-xl p-6 flex items-center justify-between transition-all duration-300
    ${isActive ? "bg-[#F0FFF4] text-[#000000] border border-[#34C759]" : "bg-white shadow-[0_4px_20px_rgba(0,0,0,0.1)]"} `}
                >
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
                        aria-label={isActive ? "Go offline" : "Go online"}
                    >
                        {isToggling ? (
                            <svg
                                className="animate-spin h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                ></path>
                            </svg>
                        ) : (
                            <span
                                className={`absolute left-[3px] w-[22px] h-[22px] rounded-full transition-all duration-300
        ${isActive ? "translate-x-[27px] bg-[#FF6F00]" : "translate-x-0 bg-white"}`}
                            ></span>
                        )}
                    </button>
                </div>

                <div className="bg-white w-full sm:w-[105%] md:w-[110%] rounded-xl sm:ml-1 shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-6 flex flex-col items-center justify-center">

                    <h1 className="text-3xl font-bold dm-sans text-black">{duration}</h1>
                    <div className="flex items-center gap-2">
                        <p className="text-gray-600 mt-2 dm-sans">
                            {checkInTime ? new Date(checkInTime).toLocaleDateString() : new Date().toLocaleDateString()}
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



































