import React from 'react'
import { useGetRatingShopQuery } from '../redux/apis/reviewApi'
import { useSelector } from 'react-redux';

const Review = () => {
    const shopId = useSelector((state) => state.auth.shopId);
    const { data, isLoading } = useGetRatingShopQuery(shopId);

    if (isLoading) {
        return (
            <div className="p-4 sm:p-5 md:p-6 bg-[#F5F5F5] mt-20 min-h-[calc(100vh-80px)]">
                <div className="bg-white shadow-sm border border-[#E5E5E5] rounded-md p-6 animate-pulse">

                    {/* Header skeleton */}
                    <div className="grid grid-cols-3 px-6 py-4 mb-4">
                        <div className="h-4 bg-gray-300 rounded w-24"></div>
                        <div className="h-4 bg-gray-300 rounded w-24"></div>
                        <div className="h-4 bg-gray-300 rounded w-24"></div>
                    </div>

                    {/* 3 Loading Rows */}
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="grid grid-cols-3 px-6 py-6 gap-4 border-b border-gray-200">

                            {/* Name */}
                            <div className="h-4 bg-gray-300 rounded w-32"></div>

                            {/* Comment */}
                            <div className="space-y-3">
                                <div className="h-4 bg-gray-300 rounded w-full"></div>
                                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-20 bg-gray-300 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }


    const reviews = data?.data?.ratingAndComment || [];

    // ⭐ FUNCTION: Render stars dynamically
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0;

        // Full Stars
        for (let i = 0; i < fullStars; i++) {
            stars.push(<span key={"full-" + i} className="text-yellow-500">⭐</span>);
        }

        // Half Star
        if (halfStar) {
            stars.push(<span key="half" className="text-yellow-500">✨</span>);
        }

        return stars;
    };

    return (
        <div className="p-4 sm:p-5 md:p-6 bg-[#F5F5F5] mt-20 min-h-[calc(100vh-80px)] overflow-y-auto">
            <div className="bg-white shadow-sm border border-[#E5E5E5] min-h-[650px]">


                {/* HEADER */}
                <div className="grid grid-cols-3 bg-[#F3F3F3] px-6 py-4 border-[#D9D9D9]">
                    <p className="text-black font-medium">Customer Name</p>
                    <p className="text-black font-medium">Comment</p>
                    <p className="text-black font-medium">Rating</p>
                </div>

                {/* ROWS */}
                {reviews.length > 0 ? (
                    reviews.map((item, index) => (
                        <div
                            key={index}
                            className="grid grid-cols-3 px-6 py-5  text-[#000] border-b border-gray-50"
                        >
                            {/* NAME */}
                            <p>{item?.userId?.Name || "Unknown"}</p>

                            {/* COMMENT */}
                            <p className="w-[90%] leading-relaxed">{item?.comment || "No Comment"}</p>

                            {/* DYNAMIC STAR RATING */}
                            {/* DYNAMIC STAR RATING + NUMBER */}
                            <div className="flex items-center  gap-2">
                                <div className="flex gap-1">{renderStars(item?.rating || 0)}</div>
                                <span className="text-black font-medium">{item?.rating}</span>
                            </div>

                        </div>
                    ))
                ) : (
                    <p className="text-center py-5 text-gray-500">No Reviews Found</p>
                )}

                <div className="h-[200px]" />
            </div>
        </div>
    );
};

export default Review;
