import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import techsurya from "/techsurya.png";
import img1 from "/img1.png";
import indianFast from "/indianFast.png";
import { Icon } from "@iconify/react";
import { useGetProfileQuery } from "../redux/apis/vendorApi";
import { useSelector } from "react-redux";

const Sidebar = ({ setPageTitle }) => {

    const sidebarRef = useRef();


    const shopId = useSelector((state) => state.auth.shopId);
    const { data, isLoading, isError } = useGetProfileQuery(shopId);
    const location = useLocation();

    const [active, setActive] = useState("Dashboard");
    const [isOpen, setIsOpen] = useState(false); // ✅ mobile menu toggle
    useEffect(() => {
        const handleClickOutside = (e) => {
            const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;


            if (isOpen && isTablet && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    useEffect(() => {
        const path = location.pathname;
        if (path.includes("/dashboard")) {
            setActive("Dashboard");
            setPageTitle("Dashboard");
        } else if (path.includes("/foodItems")) {
            setActive("Food Items & Categories");
            setPageTitle("Food Items & Categories");
        } else if (path.includes("/transactions")) {
            setActive("Transactions");
            setPageTitle("Transactions");
        } else if (path.includes("/addBanner") || path.includes("/approved-banners")) {
            setActive("Add Banner");
            setPageTitle(path.includes("/approved-banners") ? "Approved Banners" : "Add Banner");
        } else if (path.includes("/orders")) {
            setActive("Orders");
            setPageTitle("Orders");
        } else if (path.includes("/complaints")) {
            setActive("Complaints");
            setPageTitle("Complaints");
        } else if (path.includes("/personalDetails")) {
            setActive("Personal Details");
            setPageTitle("Personal Details");
        } else if (path.includes("/coupons")) {
            setActive("Coupon Code");
            setPageTitle("Coupon Code");
        } else if (path.includes("/review")) {
            setActive("Review");
            setPageTitle("Review");
        }
    }, [location.pathname, setPageTitle]);
    return (
        <>
            {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
            {/* 🔹 Mobile Top Bar */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-md flex items-center justify-between px-4 py-2">
                <div className="flex items-center gap-2">
                    <img src={techsurya} alt="Logo" className="w-24 object-contain" />
                </div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-gray-700 focus:outline-none"
                >
                    <Icon icon={isOpen ? "mdi:close" : "mdi:menu"} width={30} height={30} />
                </button>
            </div>

            {/* 🔸 Sidebar */}
            <div
                ref={sidebarRef}
                className={`overflow-hidden  fixed lg:static top-0 left-0 w-72 md:w-60 lg:w-72 z-40 transition-transform duration-300 ease-in-out 
                ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                h-screen 
                lg:h-screen 
                [768px <= screen < 1024px]:h-[130vh]   
                bg-red-100`}
            >
                <div className="w-72 md:w-60 lg:w-72 flex flex-col">
                    {/* 🔹 Top Section */}
                    {/* 🔹 Top Section */}
                    <div className="bg-white pb-4 -mt-2 flex flex-col items-center border-b border-gray-200">
                        <img src={techsurya} alt="Logo" className="w-48 -mb-7" />

                        {/* Profile Image from API */}
                        <img
                            src={data?.shop?.hotelImage || img1}
                            alt="Profile"
                            className="w-14 h-14 mb-2 rounded-full"
                        />

                        {/* Hotel Name from API */}
                        <h2
                            className="text-[#1E1E1E] text-[19.9px] font-medium tracking-[0.02em] leading-[100%]"
                            style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                            {data?.shop?.hotelName || "Techsurya It Solution"}
                        </h2>

                        {/* Owner Name */}
                        <p className="text-gray-500 text-sm">{data?.shop?.ownerName}</p>
                    </div>


                    {/* 🔸 Menu Section */}
                    {/* <div className="flex-1 bg-gradient-to-b  from-[#EF9C01] to-[#FF9129] text-white flex flex-col justify-between"> */}
                    <div
                        className="flex-1 bg-gradient-to-b from-[#EF9C01] to-[#FF9129] text-white flex flex-col justify-between relative"
                        style={{
                            minHeight: "100vh",
                            height: "100%",
                            // Tablet var force height vadhavto
                            "@media (min-width: 768px) and (max-width: 1023px)": {
                                height: "138vh"
                            }
                        }}
                    >
                        <div>
                            <p className="px-5 pt-4 text-sm opacity-90 font-medium">Menu ▼</p>

                            <ul
                                className="mt-4 px-4 text-md font-Regular"
                                style={{ fontFamily: "Poppins, sans-serif" }}
                            >
                                {/* Dashboard */}
                                <Link
                                    to="/dashboard"
                                    onClick={() => {
                                        setPageTitle("Dashboard");
                                        setActive("Dashboard");
                                        setIsOpen(false);
                                    }}
                                >
                                    <li
                                        className={`relative flex gap-3 py-2 px-3 cursor-pointer ${active === "Dashboard"
                                            ? "bg-white/15"
                                            : "hover:bg-white/10"
                                            }`}
                                    >
                                        {active === "Dashboard" && (
                                            <span
                                                className="absolute -right-4 top-1/2 -translate-y-1/2 w-0 h-0 
                                            border-t-[10px] border-t-transparent 
                                            border-b-[10px] border-b-transparent 
                                            border-r-[10px] border-r-white"
                                            ></span>
                                        )}
                                        <Icon icon="material-symbols-light:dashboard-outline" className=" w-6 h-6 sm:w-7 sm:h-7 " />
                                        Dashboard
                                    </li>
                                </Link>

                                {/* Food Items & Categories */}
                                <Link
                                    to="/foodItems"
                                    onClick={() => {
                                        setPageTitle("Food Items & Categories");
                                        setActive("Food Items & Categories");
                                        setIsOpen(false);
                                    }}
                                >
                                    <li
                                        className={`relative flex gap-3 py-2 px-3 cursor-pointer ${active === "Food Items & Categories"
                                            ? "bg-white/15"
                                            : "hover:bg-white/10"
                                            }`}
                                    >
                                        {active === "Food Items & Categories" && (
                                            <span
                                                className="absolute -right-4 top-1/2 -translate-y-1/2 w-0 h-0 
                                            border-t-[10px] border-t-transparent 
                                            border-b-[10px] border-b-transparent 
                                            border-r-[10px] border-r-white"
                                            ></span>
                                        )}
                                        <Icon icon="fluent:food-28-regular" className=" w-6 h-6 sm:w-7 sm:h-7 " />
                                        Food Items & Categories
                                    </li>
                                </Link>

                                {/* Transactions */}
                                <Link
                                    to="/transactions"
                                    onClick={() => {
                                        setPageTitle("Transactions");
                                        setActive("Transactions");
                                        setIsOpen(false);
                                    }}
                                >
                                    <li
                                        className={`relative flex gap-3 py-2 px-3 cursor-pointer ${active === "Transactions"
                                            ? "bg-white/15"
                                            : "hover:bg-white/10"
                                            }`}
                                    >
                                        {active === "Transactions" && (
                                            <span
                                                className="absolute -right-4 top-1/2 -translate-y-1/2 w-0 h-0 
                                            border-t-[10px] border-t-transparent 
                                            border-b-[10px] border-b-transparent 
                                            border-r-[10px] border-r-white"
                                            ></span>
                                        )}
                                        <Icon icon="pepicons-pencil:money-note-circle" className=" w-6 h-6 sm:w-7 sm:h-7 " />
                                        Transactions
                                    </li>
                                </Link>

                                {/* Add Banner */}
                                <Link
                                    to="/addBanner"
                                    onClick={() => {
                                        setPageTitle("Add Banner");
                                        setActive("Add Banner");
                                        setIsOpen(false);
                                    }}
                                >
                                    <li
                                        className={`relative flex gap-3 py-2 px-3 cursor-pointer ${active === "Add Banner"
                                            ? "bg-white/15"
                                            : "hover:bg-white/10"
                                            }`}
                                    >
                                        {active === "Add Banner" && (
                                            <span
                                                className="absolute -right-4 top-1/2 -translate-y-1/2 w-0 h-0 
                                            border-t-[10px] border-t-transparent 
                                            border-b-[10px] border-b-transparent 
                                            border-r-[10px] border-r-white"
                                            ></span>
                                        )}
                                        <Icon icon="material-symbols:image-outline-rounded" className=" w-6 h-6 sm:w-7 sm:h-7 " />
                                        Add Banner
                                    </li>
                                </Link>

                                {/* Orders */}
                                <Link
                                    to="/orders"
                                    onClick={() => {
                                        setPageTitle("Orders");
                                        setActive("Orders");
                                        setIsOpen(false);
                                    }}
                                >
                                    <li
                                        className={`relative flex gap-3 py-2 px-3 cursor-pointer ${active === "Orders"
                                            ? "bg-white/15"
                                            : "hover:bg-white/10"
                                            }`}
                                    >
                                        {active === "Orders" && (
                                            <span
                                                className="absolute -right-4 top-1/2 -translate-y-1/2 w-0 h-0 
                                            border-t-[10px] border-t-transparent 
                                            border-b-[10px] border-b-transparent 
                                            border-r-[10px] border-r-white"
                                            ></span>
                                        )}
                                        <Icon icon="lets-icons:order-light" className=" w-6 h-6 sm:w-7 sm:h-7 " />
                                        Orders
                                    </li>
                                </Link>

                                {/* review */}
                                <Link
                                    to="/review"
                                    onClick={() => {
                                        setPageTitle("Review");
                                        setActive("Review");
                                        setIsOpen(false);
                                    }}
                                >
                                    <li
                                        className={`relative flex gap-3 py-2 px-3 cursor-pointer ${active === "Review"
                                            ? "bg-white/15"
                                            : "hover:bg-white/10"
                                            }`}
                                    >
                                        {active === "Review" && (
                                            <span
                                                className="absolute -right-4 top-1/2 -translate-y-1/2 w-0 h-0 
                                            border-t-[10px] border-t-transparent 
                                            border-b-[10px] border-b-transparent 
                                            border-r-[10px] border-r-white"
                                            ></span>
                                        )}
                                        <Icon icon="hugeicons:complaint" className=" w-6 h-6 sm:w-7 sm:h-7" />
                                        Review
                                    </li>
                                </Link>

                                {/* Personal Details */}
                                <Link
                                    to="/personalDetails"
                                    onClick={() => {
                                        setPageTitle("Personal Details");
                                        setActive("Personal Details");
                                        setIsOpen(false);
                                    }}
                                >
                                    <li
                                        className={`relative flex gap-3 py-2 px-3 cursor-pointer ${active === "Personal Details"
                                            ? "bg-white/15"
                                            : "hover:bg-white/10"
                                            }`}
                                    >
                                        {active === "Personal Details" && (
                                            <span
                                                className="absolute -right-4 top-1/2 -translate-y-1/2 w-0 h-0 
                                            border-t-[10px] border-t-transparent 
                                            border-b-[10px] border-b-transparent 
                                            border-r-[10px] border-r-white"
                                            ></span>
                                        )}
                                        <Icon icon="solar:user-bold" className=" w-6 h-6 sm:w-7 sm:h-7 " />
                                        Personal Details
                                    </li>
                                </Link>

                                {/* Coupon Code */}
                                <Link
                                    to="/coupons"
                                    onClick={() => {
                                        setPageTitle("Coupon Code");
                                        setActive("Coupon Code");
                                        setIsOpen(false);
                                    }}
                                >
                                    {/* <li
                                        className={`relative flex gap-3 py-2 px-3 cursor-pointer ${active === "Coupon Code"
                                            ? "bg-white/15"
                                            : "hover:bg-white/10"
                                            }`}
                                    >
                                        {active === "Coupon Code" && (
                                            <span
                                                className="absolute -right-4 top-1/2 -translate-y-1/2 w-0 h-0 
                                            border-t-[10px] border-t-transparent 
                                            border-b-[10px] border-b-transparent 
                                            border-r-[10px] border-r-white"
                                            ></span>
                                        )}
                                        <Icon icon="mdi:coupon-outline" className=" w-6 h-6 sm:w-7 sm:h-7 " />
                                        Coupon Code
                                    </li> */}
                                </Link>
                            </ul>
                        </div>

                        {/* Bottom Section */}
                        <div className="p-5 mt-16 mb-6 flex items-center justify-center">
                            <div className="flex items-center gap-3">
                                <p className="text-[#FFFFFF] -mr-3 text-[100%] mt-1">
                                    Partner with
                                </p>
                                <img
                                    src={indianFast}
                                    alt="Indian Fast"
                                    className="w-[59%] h-auto object-contain mb-4"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 🔹 Overlay */}
            {/* {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm z-30 sm:hidden"
                    onClick={() => setIsOpen(false)}
                ></div>
            )} */}



            {isOpen && (
                <div
                    className="fixed inset-0 z-30 sm:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

export default Sidebar;
