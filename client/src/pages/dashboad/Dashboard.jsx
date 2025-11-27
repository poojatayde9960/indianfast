import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { useNavigate, useOutletContext } from "react-router-dom";
import vector from "/vector.png";
import veg from "/veg.png";
import NewOrderRequests from "./NewOrderRequests";
import { useGetOrderByShopIdQuery } from "../../redux/apis/orderApi";
import { useDispatch, useSelector } from "react-redux";
import { useToggleAvailabilityMutation } from "../../redux/apis/attendance";
import { setActive, setCheckInTime } from "../../redux/slices/vendorSlice";

const Dashboard = () => {
    const { isActive = false, checkInTime = null, shopId = null } = useSelector(
        (state) => state.auth || {}
    );
    const { data, isLoading, isError, refetch } = useGetOrderByShopIdQuery(shopId, {
        skip: !shopId,
        // refetchOnMountOrArgChange: true
    });
    useEffect(() => {
        if (shopId) {
            refetch(); // hydrated shopId
        }
    }, [shopId, refetch]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { setPageTitle } = useOutletContext();

    // RTK Query mutation hook
    const [toggleAvailability, { isLoading: isToggling }] = useToggleAvailabilityMutation();

    const [accumulatedTime, setAccumulatedTime] = useState(0);

    useEffect(() => {
        const today = new Date().toLocaleDateString('en-US');
        const storedDate = localStorage.getItem('lastActiveDate');
        const storedAccumulated = parseInt(localStorage.getItem('accumulatedActiveTime')) || 0;

        const checkIn = checkInTime ? new Date(checkInTime).toLocaleDateString('en-US') : null;

        // ❗ Date changed → reset
        if (storedDate !== today) {
            localStorage.setItem('lastActiveDate', today);
            localStorage.setItem('accumulatedActiveTime', '0');
            setAccumulatedTime(0);

            // 🔥 EXTRA FIX → clear old checkInTime from yesterday
            if (checkIn && checkIn !== today) {
                dispatch(setCheckInTime(null));
            }

        } else {
            setAccumulatedTime(storedAccumulated);
        }
    }, [checkInTime]);


    // ✅ Handle toggle availability - calls backend API
    const handleToggleAvailability = async () => {
        // Validate shopId exists
        if (!shopId) {
            alert("Shop ID is missing. Please login again.");
            return;
        }

        try {
            // Call the backend API
            const result = await toggleAvailability({
                ShopId: shopId,
            }).unwrap();

            // Update Redux state based on API response
            // The API should return the new status and checkInTime
            const newStatus = result?.isActive ?? !isActive;
            let newCheckInTime = newStatus
                ? (result?.checkInTime || new Date().toISOString())
                : null;

            // Accumulate time if going offline
            if (!newStatus && isActive && checkInTime) {
                const now = new Date();
                const start = new Date(checkInTime);
                const diff = now - start;
                const newAccumulated = accumulatedTime + diff;
                setAccumulatedTime(newAccumulated);
                localStorage.setItem('accumulatedActiveTime', newAccumulated.toString());
            }

            // Dispatch actions to update Redux state
            dispatch(setActive(newStatus));
            dispatch(setCheckInTime(newCheckInTime));

            // Optional: Log success
            console.log("✅ Availability toggled successfully:", result);
        } catch (error) {
            // Handle errors
            console.error("❌ Error toggling availability:", error);
            const errorMessage =
                error?.data?.message ||
                error?.data?.error ||
                error?.message ||
                "Failed to toggle availability. Please try again.";
            alert(errorMessage);
        }
    };

    const [duration, setDuration] = useState("00 : 00 : 00");

    // ✅ Timer logic
    useEffect(() => {
        const calculateDuration = () => {
            let totalMs = accumulatedTime;
            const now = new Date();

            if (isActive && checkInTime) {
                const start = new Date(checkInTime);

                const isSameDay =
                    now.toLocaleDateString("en-US") === start.toLocaleDateString("en-US");


                if (isSameDay) {
                    totalMs += now - start;
                }
            }

            const hours = String(Math.floor(totalMs / (1000 * 60 * 60))).padStart(2, "0");
            const minutes = String(Math.floor((totalMs / (1000 * 60)) % 60)).padStart(2, "0");
            const seconds = String(Math.floor((totalMs / 1000) % 60)).padStart(2, "0");

            setDuration(`${hours} : ${minutes} : ${seconds}`);
        };

        calculateDuration();

        let interval;
        if (isActive) {
            interval = setInterval(calculateDuration, 1000);
        }

        return () => interval && clearInterval(interval);
    }, [isActive, checkInTime, accumulatedTime]);


    const orders = data?.orders || [];

    // ✅ Dynamic counts
    const totalOrders = orders.length;
    const deliveredOrders = orders.filter((o) => o.orderStatus === "delivered").length;
    const readyOrders = orders.filter((o) => o.orderStatus === "ready" || o.orderStatus === "orderAccepted").length;
    const rejectedOrders = orders.filter((o) => o.orderStatus === "rejected").length;
    const pickupOrders = orders.filter((o) => o.orderStatus === "pickup").length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentSummary?.vendorAmount || 0), 0);

    // if (isLoading) return <p className="text-center mt-52">Loading orders...</p>;
    if (isLoading) {
        return (
            <div className="p-4 sm:p-5 md:p-6 bg-[#F5F5F5] mt-20 min-h-[calc(100vh-80px)] md:h-[calc(100vh-80px)] overflow-y-auto transition-all duration-500">

                {/* Skeleton cards grid */}
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

    // if (isError) return <p className="text-center mt-52 text-red-500">Failed to load orders.</p>;

    return (
        <div className="p-4 sm:p-5 md:p-6 bg-[#F5F5F5] mt-20 min-h-[calc(100vh-80px)] md:h-[calc(100vh-80px)] overflow-y-auto transition-all duration-500">
            {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-12 mb-8"> */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-12 mb-8 w-full">

                {/* Total Orders */}
                <div
                    onClick={() => navigate("/totalOrders")}
                    className="cursor-pointer bg-white rounded-3xl h-36 shadow-[0_4px_20px_0_rgba(0,0,0,0.1)] p-5 flex flex-col justify-between hover:shadow-[0_8px_25px_rgba(0,0,0,0.2)] transition-shadow duration-300"
                >
                    <div className="flex justify-between items-center">
                        <h3 className="text-[#1E1E1E] text-[122%] font-Poppins mb-1">Total Orders</h3>
                        <div className="w-11 h-11 flex items-center justify-center rounded-full bg-[#3F922426]">
                            <Icon icon="lets-icons:order-light" className="text-[#EF9C01] w-7 h-7 font-bold" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-3xl dm-sans mb-3 font-bold text-gray-900">{totalOrders}</h2>
                        <p className="text-sm text-[#808080] font-Poppins">All orders received</p>
                    </div>
                </div>

                {/* Delivered Orders */}
                <div className="bg-white rounded-3xl h-36 shadow-[0_4px_20px_0_rgba(0,0,0,0.1)] p-5 flex flex-col justify-between hover:shadow-[0_8px_25px_rgba(0,0,0,0.2)] transition-shadow duration-300">
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

                {/* Total Revenue */}
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
                        <h2 className="text-3xl dm-sans mb-3 font-bold text-gray-900">₹ {totalRevenue.toFixed(2)}</h2>
                        <p className="text-sm text-[#808080] font-Poppins">Vendor earnings</p>
                    </div>
                </div>

                {/* Availability Toggle */}
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
                        {/* ✅ Spinner while toggling */}
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

                {/* Timer */}
                {/* <div className="bg-white w-[110%] rounded-xl ml-3 shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-6 flex flex-col items-center justify-center"> */}
                <div className="bg-white w-full sm:w-[105%] md:w-[110%] rounded-xl sm:ml-1 shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-6 flex flex-col items-center justify-center">

                    <h1 className="text-3xl font-bold dm-sans text-black">{duration}</h1>
                    <p className="text-gray-600 mt-2 dm-sans">
                        {checkInTime ? new Date(checkInTime).toLocaleDateString() : new Date().toLocaleDateString()}
                    </p>
                </div>
            </div>

            {/* Existing Section */}
            <NewOrderRequests />
        </div>
    );
};

export default Dashboard;









































// import React, { useEffect, useState } from "react";
// import { Icon } from "@iconify/react";
// import { useNavigate, useOutletContext } from "react-router-dom";
// import vector from "/vector.png";
// import veg from "/veg.png";
// import NewOrderRequests from "./NewOrderRequests";
// import { useGetOrderByShopIdQuery } from "../../redux/apis/orderApi";
// import { useDispatch, useSelector } from "react-redux";
// import { useToggleAvailabilityMutation } from "../../redux/apis/AttendanceApi";
// import { setActive, setCheckInTime } from "../../redux/slices/vendorSlice";

// const Dashboard = () => {
//     const { isActive = false, checkInTime = null, shopId = null } = useSelector(
//         (state) => state.auth || {}
//     );
//     const { data, isLoading, isError, refetch } = useGetOrderByShopIdQuery(shopId, {
//         skip: !shopId,
//         // refetchOnMountOrArgChange: true
//     });
//     useEffect(() => {
//         if (shopId) {
//             refetch(); // hydrated shopId
//         }
//     }, [shopId, refetch]);
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const { setPageTitle } = useOutletContext();

//     // RTK Query mutation hook
//     const [toggleAvailability, { isLoading: isToggling }] = useToggleAvailabilityMutation();

//     // ✅ Handle toggle availability - calls backend API
//     const handleToggleAvailability = async () => {
//         // Validate shopId exists
//         if (!shopId) {
//             alert("Shop ID is missing. Please login again.");
//             return;
//         }

//         try {
//             // Call the backend API
//             const result = await toggleAvailability({
//                 ShopId: shopId,
//             }).unwrap();

//             // Update Redux state based on API response
//             // The API should return the new status and checkInTime
//             const newStatus = result?.isActive ?? !isActive;
//             const newCheckInTime = newStatus
//                 ? (result?.checkInTime || new Date().toISOString())
//                 : null;

//             // Dispatch actions to update Redux state
//             dispatch(setActive(newStatus));
//             dispatch(setCheckInTime(newCheckInTime));

//             // Optional: Log success
//             console.log("✅ Availability toggled successfully:", result);
//         } catch (error) {
//             // Handle errors
//             console.error("❌ Error toggling availability:", error);
//             const errorMessage =
//                 error?.data?.message ||
//                 error?.data?.error ||
//                 error?.message ||
//                 "Failed to toggle availability. Please try again.";
//             alert(errorMessage);
//         }
//     };

//     const [duration, setDuration] = useState("00 : 00 : 00");

//     // ✅ Timer logic
//     useEffect(() => {
//         if (!checkInTime || !isActive) return;

//         const interval = setInterval(() => {
//             const now = new Date();
//             const start = new Date(checkInTime);
//             const diff = now - start;

//             const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, "0");
//             const minutes = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, "0");
//             const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");

//             setDuration(`${hours} : ${minutes} : ${seconds}`);
//         }, 1000);

//         return () => clearInterval(interval);
//     }, [checkInTime, isActive]);


//     const orders = data?.orders || [];

//     // ✅ Dynamic counts
//     const totalOrders = orders.length;
//     const deliveredOrders = orders.filter((o) => o.orderStatus === "delivered").length;
//     const readyOrders = orders.filter((o) => o.orderStatus === "ready" || o.orderStatus === "orderAccepted").length;
//     const rejectedOrders = orders.filter((o) => o.orderStatus === "rejected").length;
//     const pickupOrders = orders.filter((o) => o.orderStatus === "pickup").length;
//     const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentSummary?.vendorAmount || 0), 0);

//     if (isLoading) return <p className="text-center mt-52">Loading orders...</p>;
//     if (isError) return <p className="text-center mt-52 text-red-500">Failed to load orders.</p>;

//     return (
//         <div className="p-4 sm:p-5 md:p-6 bg-[#F5F5F5] mt-20 min-h-[calc(100vh-80px)] md:h-[calc(100vh-80px)] overflow-y-auto transition-all duration-500">
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-12 mb-8">

//                 {/* Total Orders */}
//                 <div
//                     onClick={() => navigate("/totalOrders")}
//                     className="cursor-pointer bg-white rounded-3xl h-36 shadow-[0_4px_20px_0_rgba(0,0,0,0.1)] p-5 flex flex-col justify-between hover:shadow-[0_8px_25px_rgba(0,0,0,0.2)] transition-shadow duration-300"
//                 >
//                     <div className="flex justify-between items-center">
//                         <h3 className="text-[#1E1E1E] text-[122%] font-Poppins mb-1">Total Orders</h3>
//                         <div className="w-11 h-11 flex items-center justify-center rounded-full bg-[#3F922426]">
//                             <Icon icon="lets-icons:order-light" className="text-[#EF9C01] w-7 h-7 font-bold" />
//                         </div>
//                     </div>
//                     <div>
//                         <h2 className="text-3xl dm-sans mb-3 font-bold text-gray-900">{totalOrders}</h2>
//                         <p className="text-sm text-[#808080] font-Poppins">All orders received</p>
//                     </div>
//                 </div>

//                 {/* Delivered Orders */}
//                 <div className="bg-white rounded-3xl h-36 shadow-[0_4px_20px_0_rgba(0,0,0,0.1)] p-5 flex flex-col justify-between hover:shadow-[0_8px_25px_rgba(0,0,0,0.2)] transition-shadow duration-300">
//                     <div className="flex justify-between items-center">
//                         <h3 className="text-[#1E1E1E] text-[122%] font-Poppins mb-1">Delivered Orders</h3>
//                         <div className="w-11 h-11 flex items-center justify-center rounded-full bg-[#3F922426]">
//                             <Icon icon="mdi:truck-delivery-outline" className="text-[#EF9C01] w-7 h-7 font-bold" />
//                         </div>
//                     </div>
//                     <div>
//                         <h2 className="text-3xl dm-sans mb-3 font-bold text-gray-900">{deliveredOrders}</h2>
//                         <p className="text-sm text-[#808080] font-Poppins">Orders successfully delivered</p>
//                     </div>
//                 </div>

//                 {/* Total Revenue */}
//                 <div
//                     onClick={() => {
//                         navigate("/transactions");
//                         setPageTitle("Transactions");
//                     }}
//                     className="bg-white rounded-3xl h-36 shadow-[0_4px_20px_0_rgba(0,0,0,0.1)] p-5 flex flex-col justify-between hover:shadow-[0_8px_25px_rgba(0,0,0,0.2)] transition-shadow duration-300"
//                 >
//                     <div className="flex justify-between items-center">
//                         <h3 className="text-[#1E1E1E] text-[122%] font-Poppins mb-1">Total Revenue</h3>
//                         <div className="w-11 h-11 flex items-center justify-center rounded-full bg-[#3F922426]">
//                             <Icon icon="pepicons-pencil:money-note-circle" className="text-[#EF9C01] w-7 h-7 font-bold" />
//                         </div>
//                     </div>
//                     <div>
//                         <h2 className="text-3xl dm-sans mb-3 font-bold text-gray-900">₹ {totalRevenue.toFixed(2)}</h2>
//                         <p className="text-sm text-[#808080] font-Poppins">Vendor earnings</p>
//                     </div>
//                 </div>

//                 {/* Availability Toggle */}
//                 <div
//                     className={`w-[110%] rounded-xl p-6 flex items-center justify-between transition-all duration-300
//             ${isActive ? "bg-[#F0FFF4] text-[#000000] border border-[#34C759]" : "bg-white shadow-[0_4px_20px_rgba(0,0,0,0.1)]"} `}
//                 >
//                     <div>
//                         <h2 className="text-xl font-semibold dm-sans transition-all duration-300">
//                             {isActive ? "You're Online" : "You're Offline"}
//                         </h2>
//                         <p className={`text-sm mt-1 transition-all duration-300 ${isActive ? "text-[#1E1E1E]" : "text-gray-500"}`}>
//                             {isActive ? "Ready to accept orders" : "Turn on to start receiving orders"}
//                         </p>
//                     </div>
//                     <button
//                         onClick={handleToggleAvailability}
//                         disabled={isToggling || !shopId}
//                         className={`relative w-[55px] h-[28px] rounded-full flex items-center transition-all duration-300
//               ${isActive ? "bg-black" : "bg-[#D9D9D9]"}
//               ${isToggling ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
//               ${!shopId ? "opacity-50 cursor-not-allowed" : ""}`}
//                         aria-label={isActive ? "Go offline" : "Go online"}
//                     >
//                         <span
//                             className={`absolute left-[3px] w-[22px] h-[22px] rounded-full transition-all duration-300
//                 ${isActive ? "translate-x-[27px] bg-[#FF6F00]" : "translate-x-0 bg-white"}`}
//                         ></span>
//                     </button>
//                 </div>

//                 {/* Timer */}
//                 <div className="bg-white w-[110%] rounded-xl ml-3 shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-6 flex flex-col items-center justify-center">
//                     <h1 className="text-3xl font-bold dm-sans text-black">{duration}</h1>
//                     <p className="text-gray-600 mt-2 dm-sans">
//                         {checkInTime ? new Date(checkInTime).toLocaleDateString() : new Date().toLocaleDateString()}
//                     </p>
//                 </div>
//             </div>

//             {/* Existing Section */}
//             <NewOrderRequests />
//         </div>
//     );
// };

// export default Dashboard;
