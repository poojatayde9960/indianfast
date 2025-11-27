import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import img3 from "/img3.png";
import img2 from "/img2.png";
import { useAddOfferMutation, useGetBannerQuery } from "../../redux/apis/offerApi";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const AddBanner = () => {
    const [addOffer] = useAddOfferMutation()

    const shopId = useSelector((state) => state.auth.shopId);

    // Pass shopId dynamically to the query
    const { data: banners, isLoading, isError } = useGetBannerQuery(shopId);

    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);
    const handleOverlayClick = (e) => {

        if (e.target === e.currentTarget) {
            setShowPopup(false);
        }
    };
    const { register, handleSubmit, reset } = useForm();
    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("payment", data.payment);
        formData.append("shopId", shopId);
        formData.append("image", data.image[0]);

        const res = await addOffer(formData);

        if (res?.data) {
            toast.success("Banner Added Successfully!");
            // alert("Banner Added Successfully!");
            reset();
            setShowPopup(false);
        } else {
            alert("Failed to upload banner");
        }
    };

    return <>

        {/* <pre className="text-black mt-48">{JSON.stringify(banners, null, 2)}</pre> */}

        <div className="p-4 sm:p-5 md:p-6 bg-[#F5F5F5] mt-20 min-h-[calc(100vh-80px)] md:h-[calc(100vh-80px)] overflow-y-auto transition-all duration-500">

            {/* Top buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 mb-6 sm:mb-10">
                <button
                    onClick={() => navigate("/approved-banners")}
                    className="hover:opacity-90 bg-[#FF9129] text-white px-4 py-3 sm:px-6 sm:py-4 rounded-md shadow text-base sm:text-[135%]"
                >
                    See Approved Banners
                </button>

                <button
                    onClick={() => setShowPopup(true)}
                    className="bg-[#3F9224] hover:opacity-90 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-md text-base sm:text-[135%] shadow"
                >
                    +Add Banner
                </button>
            </div>


            <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-8 bg-[#FFFFFF] p-4 sm:p-11 min-h-[80vh] lg:min-h-0 lg:h-[560px] overflow-y-auto">
                {isLoading && (
                    <div className="w-full flex flex-wrap gap-8">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="w-[380px] flex flex-col items-center space-y-3"
                            >
                                {/* Image shimmer */}
                                <div className="w-[380px] h-[180px] rounded-xl overflow-hidden bg-gray-300 relative">
                                    <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
                                </div>

                                {/* Delete icon shimmer */}
                                <div className="w-8 h-8 rounded-full bg-gray-300 relative overflow-hidden">
                                    <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
                                </div>
                            </div>
                        ))}

                        {/* Shimmer Animation Style */}
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

                {isError && <p>Failed to load banners</p>}
                {!isLoading && !banners?.data?.length && <p>No banners found</p>}

                {banners?.data?.map((banner) => (
                    <div key={banner._id} className="flex flex-col items-center">
                        <img
                            src={banner.image}
                            className="rounded-[10px] w-[380px] h-[180px] object-cover shadow-md"
                        />
                        {/* <Icon
                            icon="mdi-light:delete"
                            className="text-[#E10202] font-bold mt-3 text-[24px]"
                        /> */}
                    </div>
                ))}
            </div>




            {/* Popup Overlay */}
            {showPopup && (
                <div
                    onClick={handleOverlayClick}
                    className="fixed inset-0 bg-[#00000066] flex justify-center items-center z-50 px-4"
                >
                    <div className="bg-white rounded-[25px] p-6 sm:p-8 w-full max-w-[460px] shadow-lg relative">

                        <h2 className="text-black text-[150%] mb-4">Upload Banner</h2>

                        {/* FORM START */}
                        <form onSubmit={handleSubmit(onSubmit)}>

                            {/* Upload Box */}
                            <label className="flex flex-col justify-center items-center bg-[#D9D9D963] w-full h-[157px] cursor-pointer mx-auto rounded-md">
                                <Icon icon="material-symbols:upload" className="text-[#000000B5] text-[28px] mb-2" />
                                <span className="text-[#000000B5] text-[120%]">Upload Banner</span>
                                <input type="file" className="hidden" {...register("image")} required />
                            </label>

                            {/* Payment Input */}
                            <input
                                type="text"
                                placeholder="Payment"
                                {...register("payment")}
                                className="w-full border text-black mt-3 border-[#D9D9D9] px-4 py-2.5 rounded-sm"
                                required
                            />

                            {/* Add Banner Button */}
                            <div className="flex justify-center mt-6">
                                <button
                                    type="submit"
                                    className="bg-[#3F9224] hover:bg-[#347b1f] text-white text-[120%] px-10 py-4 rounded-lg"
                                >
                                    +Add Banner
                                </button>
                            </div>

                        </form>
                        {/* FORM END */}

                    </div>
                </div>
            )}
        </div>
    </>
};

export default AddBanner;
