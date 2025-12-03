import React from 'react';
import { FaAngleLeft } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetBannerQuery } from '../../redux/apis/offerApi';

const SeeApprovedBanners = () => {
    const shopId = useSelector((state) => state.auth.shopId);
    const { data, isLoading, isError } = useGetBannerQuery(shopId);
    const navigate = useNavigate();

    const banners = data?.data || [];
    const approvedBanners = banners.filter(b => b.status === "approved");

    return (
        <>
            {/* <div className="p-4 sm:p-5 md:p-6 bg-[#F8F8F8] mt-20 min-h-[calc(100vh-80px)] md:h-[calc(100vh-80px)] overflow-y-auto transition-all duration-500"> */}
            <div className="p-4 sm:p-5 md:p-6  mt-20 min-h-screen overflow-y-auto transition-all duration-500">

                {/* Back Button */}
                <div className="flex gap-4 mb-10">
                    <button
                        onClick={() => navigate("/addBanner")}
                        className="text-black font-bold flex items-center gap-2 text-[190%] dm-sans hover:opacity-80 transition-all"
                    >
                        <FaAngleLeft className="text-[75%]" />
                        <span>Approved Banners</span>
                    </button>
                </div>

                <div className="flex flex-wrap p-5 gap-9 bg-white">

                    {/* SHIMMER LOADING */}
                    {isLoading && (
                        <div className="w-full flex flex-wrap gap-8">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="w-[380px] flex flex-col items-center space-y-3"
                                >
                                    <div className="w-[380px] h-[180px] rounded-xl overflow-hidden bg-gray-300 relative">
                                        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
                                    </div>

                                    <div className="w-8 h-8 rounded-full bg-gray-300 relative overflow-hidden">
                                        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
                                    </div>
                                </div>
                            ))}

                            <style>
                                {`
                                .animate-shimmer {
                                    animation: shimmer 2s infinite linear;
                                    background-size: 1000px 100%;
                                }
                                @keyframes shimmer {
                                    0% { background-position: -1000px 0; }
                                    100% { background-position: 1000px 0; }
                                }
                                `}
                            </style>
                        </div>
                    )}

                    {/* ERROR */}
                    {isError && <p>Failed to load banners</p>}

                    {/* NO APPROVED BANNERS */}
                    {!isLoading && approvedBanners.length === 0 && (
                        <p>No approved banners found</p>
                    )}

                    {/* SHOW ONLY APPROVED BANNERS */}
                    {!isLoading && approvedBanners.map((banner) => (
                        <div key={banner._id} className="flex flex-col items-center relative">
                            <img
                                src={banner.image}
                                alt="Banner"
                                className="rounded-[10px] w-[380px] h-[180px] object-cover shadow-md"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default SeeApprovedBanners;
