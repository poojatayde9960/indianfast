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

    return (
        // <div className="p-6 bg-[#F5F5F5] mt-20 min-h-[calc(100vh-80px)]">
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

            <div className="mt-4">
                {reviews.length > 0 ? (
                    reviews.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white border border-[#FF9129] rounded-xl p-5 mt-4 w-[60%]"
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
                    <p className="text-center text-gray-500 mt-10">No Reviews Found</p>
                )}
            </div>

            <div className="h-20" />
        </div >
    );
};

export default Review;
