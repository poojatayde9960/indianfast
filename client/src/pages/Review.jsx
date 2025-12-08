import React from "react";
import { useGetRatingShopQuery } from "../redux/apis/reviewApi";
import { useSelector } from "react-redux";

const Review = () => {
    const shopId = useSelector((state) => state.auth.shopId);
    const { data, isLoading } = useGetRatingShopQuery(shopId);

    const shopData = data?.data?.shopId;
    const reviews = data?.data?.ratingAndComment || [];
    const avgRating = data?.data?.averageRating || 0;

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 0; i < Math.floor(rating); i++) {
            stars.push(
                <span key={i} className="text-yellow-500 text-xl">★</span>
            );
        }
        return stars;
    };
    if (isLoading) {
        return (
            <div className="p-4 sm:p-5 md:p-6 bg-[#F5F5F5] mt-20 min-h-[calc(100vh-80px)] overflow-y-auto">

                {/* SHOP CARD SKELETON */}
                <div className="bg-white rounded-xl border shadow p-6 animate-pulse flex gap-6 items-center">

                    {/* IMAGE */}
                    <div className="w-28 h-28 bg-slate-300 rounded-xl"></div>

                    {/* TEXT */}
                    <div className="flex-1">
                        <div className="h-5 w-40 bg-slate-300 rounded mb-3"></div>
                        <div className="h-4 w-52 bg-slate-300 rounded mb-3"></div>

                        <div className="flex gap-2 items-center">
                            <div className="w-6 h-6 bg-slate-300 rounded-full"></div>
                            <div className="h-4 w-32 bg-slate-300 rounded"></div>
                        </div>
                    </div>
                </div>

                {/* USER FEEDBACK HEADING */}
                <div className="h-6 w-48 bg-slate-300 rounded mt-8 animate-pulse"></div>

                {/* REVIEW CARDS SKELETON */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Array.from({ length: 4 }).map((_, idx) => (
                        <div key={idx} className="bg-white border rounded-xl p-5 animate-pulse">

                            <div className="flex items-center gap-4">
                                {/* Avatar */}
                                <div className="h-12 w-12 bg-slate-300 rounded-full"></div>

                                <div className="flex-1">
                                    <div className="h-4 w-32 bg-slate-300 rounded mb-2"></div>

                                    {/* Stars */}
                                    <div className="flex gap-1">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <div key={i} className="w-4 h-4 bg-slate-300 rounded"></div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Comment */}
                            <div className="mt-4 space-y-2">
                                <div className="h-3 w-full bg-slate-300 rounded"></div>
                                <div className="h-3 w-3/4 bg-slate-300 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="h-20"></div>
            </div>
        );
    }


    return <>


        {/* <div className="p-6 bg-[#F5F5F5] mt-20 min-h-[calc(100vh-80px)]"> */}
        <div className="p-4 sm:p-5 md:p-6 bg-[#F5F5F5] mt-20 min-h-[calc(100vh-80px)] md:h-[calc(100vh-80px)] overflow-y-auto transition-all duration-500">
            {/* SHOP INFO CARD */}
            <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 flex gap-6 items-center">

                {/* SHOP IMAGE */}
                {/* <img
                    src={shopData?.hotelImage}
                    alt="Shop"
                    className="w-28 h-28 object-cover rounded-xl border"
                /> */}

                {/* SHOP DETAILS */}
                <div>
                    <p className="text-xl font-semibold text-gray-900">
                        {shopData?.hotelName}
                    </p>

                    <p className="text-gray-600 mt-1">
                        <span className="font-semibold">Contact:</span> {shopData?.hotelNumber}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-yellow-500 text-xl">⭐</span>
                        <span className="text-gray-800 font-semibold">
                            Average Rating: {avgRating}
                        </span>
                    </div>
                </div>
            </div>

            <p className="mt-6 text-xl font-semibold text-gray-800">User Feedback</p>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.length > 0 ? (
                    reviews.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white border border-[#FF9129] rounded-xl p-5"
                        >
                            {/* USER ROW */}
                            <div className="flex items-center gap-4">
                                {/* USER AVATAR */}
                                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-2xl">👤</span>
                                </div>

                                <div>
                                    <p className="text-lg font-semibold text-gray-800">
                                        {item?.userId?.Name || "User"}
                                    </p>

                                    <div className="flex gap-1 mt-1">
                                        {renderStars(item?.rating)}
                                    </div>
                                </div>
                            </div>

                            <p className="text-gray-700 mt-3 leading-relaxed">
                                {item?.comment || "No Comment"}
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 mt-10 col-span-2">No Reviews Found</p>
                )}
            </div>


            <div className="h-20" />
        </div >
    </>
};

export default Review;
