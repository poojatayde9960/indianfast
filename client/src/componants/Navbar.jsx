import { Icon } from "@iconify/react";
import React, { useState } from "react";
import img1 from "/img1.png";
import techsurya from "/techsurya.png";
import { useLocation } from "react-router-dom";
import { useGetProfileQuery, useVendorLogoutMutation } from "../redux/apis/vendorApi";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/vendorSlice";
import { useNavigate } from "react-router-dom";
import { useGetToggleAvailabilityMutation } from "../redux/apis/attendance";
// import { logout } from "../redux/slices/authSlice"; 

const Navbar = ({ title, searchTerm, setSearchTerm }) => {
    const [getToggleAvailability, { data: toggleData, isLoading: toggleIsLoading, error }] = useGetToggleAvailabilityMutation();
    const handleToggleAvailability = async () => {
        if (!shopId) return alert("Shop ID not found!");

        try {
            const result = await getToggleAvailability({ ShopId: shopId }).unwrap();
            console.log("✅ Availability toggled:", result);
        } catch (err) {
            console.error("❌ Error toggling availability:", err);
            alert(err?.data?.message || "Availability error");
        }
    };

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [vendorLogout] = useVendorLogoutMutation()
    const handleLogout = async () => {
        try {
            await vendorLogout(shopId).unwrap();
            dispatch(logout());
            localStorage.removeItem("shopId");
            localStorage.removeItem("token");
            navigate("/");
        } catch (error) {
            console.error("Logout failed", error);

            dispatch(logout());
            localStorage.removeItem("shopId");
            navigate("/");
        }
    };
    const shopId = useSelector((state) => state.auth.shopId);
    const { data, isLoading, isError } = useGetProfileQuery(shopId);
    const location = useLocation();
    let pageTitle = "";
    if (location.pathname.includes("orders")) {
        pageTitle = "Orders";
    } else if (location.pathname.includes("food-items")) {
        pageTitle = "Food Items & Categories";
    } else if (location.pathname.includes("dashboard")) {
        pageTitle = "Dashboard";
    } else {
        pageTitle = title || "Dashboard";
    }

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleNotifications = () => setShowNotifications(!showNotifications);
    const toggleProfile = () => setShowProfile(!showProfile);
    const closeAll = () => {
        setShowNotifications(false);
        setShowProfile(false);
        setMenuOpen(false);
    };


    return (
        <>
            {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
            {(showNotifications || showProfile || menuOpen) && (
                <div
                    className="fixed inset-0 bg-[rgba(0,0,0,0.15)] z-50"
                    onClick={closeAll}
                ></div>
            )}

            <nav className="fixed top-0 left-0 right-0 md:left-72 h-[70px] md:h-[80px]  flex items-center justify-between px-4 md:px-8  z-50">
                {/* Left Section */}
                <div className="flex items-center gap-4 md:gap-6">

                    <button
                        className="md:hidden text-2xl text-gray-700"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <Icon icon="mdi:menu" />
                    </button>

                    <h1 className="text-lg md:text-xl font-semibold text-gray-800 whitespace-nowrap">
                        {pageTitle}
                    </h1>


                    {(pageTitle === "Food Items & Categories" || pageTitle === "Orders") && (
                        <div className="hidden sm:flex relative items-center ml-2 md:ml-10">
                            <Icon
                                icon="ic:twotone-search"
                                className="text-[20px] md:text-[22px] text-[#808080] absolute left-3"
                            />



                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 pr-4 py-2 text-sm text-black placeholder:text-[#808080]
                    transition focus:outline-none 
                    border sm:border md:border-0
                    rounded-md sm:w-[180px] md:w-[250px]"
                            />
                        </div>
                    )}
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4 md:gap-6 relative">

                    <div
                        onClick={toggleProfile}
                        className="w-10 h-10 md:w-[49px] md:h-[49px] rounded-full bg-[#FF9F03] flex items-center justify-center text-white text-lg cursor-pointer z-50"
                    >
                        {data?.shop?.hotelName?.charAt(0)?.toUpperCase() || "A"}
                    </div>




                </div>
            </nav>

            {/* Profile Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-[85%] sm:w-[320px] bg-white shadow-lg transform transition-transform duration-300 z-50 ${showProfile ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex flex-col items-center mt-10 px-6">
                    {/* <img src={techsurya} alt="Logo" className="w-40 md:w-48 h-28 md:h-36 -mb-4" /> */}
                    <img src={data?.shop?.hotelImage || img1} alt="User" className="text-black w-14 md:w-16 h-14 md:h-16 mt-2" />


                    <h2 className="text-base md:text-lg text-[#1E1E1E] mt-3 text-center">
                        {data?.shop?.hotelName || "Loading..."}
                    </h2>

                    <hr className="w-full border-gray-300 my-4" />


                    <div className="w-full flex flex-col items-center justify-center gap-4 mt-4">

                        {/* Email */}
                        <div className="flex  items-center justify-start gap-3 w-full">
                            <Icon icon="mdi:email" className="text-[#FF9F03] text-xl md:text-2xl" />
                            <span className="text-xs md:text-sm text-[#1E1E1E] text-center">
                                {data?.shop?.hotelEmail || "No Email"}
                            </span>
                        </div>

                        {/* Phone */}
                        <div className="flex items-center justify-start gap-3 w-full">
                            <Icon icon="mdi:phone" className="text-[#FF9F03] text-xl md:text-2xl" />
                            <span className="text-xs md:text-sm text-[#1E1E1E] text-center">
                                {data?.shop?.hotelNumber || "No Number"}
                            </span>
                        </div>

                    </div>


                </div>

                <button onClick={handleLogout} className=" ml-12 p-20 mt-10 mb-6  flex items-center justify-center gap-2 
    bg-red-500 text-white py-2.5 rounded-lg shadow-md hover:bg-red-600 
    transition-all duration-200 active:scale-95">
                    <Icon icon="mdi:logout" className="text-xl" />
                    Logout
                </button>

            </div>

            {/* Mobile Menu Drawer */}
            <div
                className={`fixed top-0 left-0 h-full w-[80%] sm:w-[300px] bg-white shadow-md transform transition-transform duration-300 z-50 ${menuOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex justify-between items-center p-5 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
                    <button onClick={closeAll}>
                        <Icon icon="mdi:close" className="text-2xl text-gray-600" />
                    </button>
                </div>
                <div className="p-4 text-gray-700">
                    <p className="py-2 border-b">Dashboard</p>
                    <p className="py-2 border-b">Orders</p>
                    <p className="py-2 border-b">Food Items</p>
                    <p className="py-2 border-b">Profile</p>
                </div>
            </div>
        </>
    );
};

export default Navbar;
