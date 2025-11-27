import React from "react";
import background from "/background.jpg";
import indianFast from "/indianFast.png";
import food1 from "/food1.png";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
    useVendorLoginMutation,
    useVerifyLoginOtpMutation,
} from "../redux/apis/vendorApi";
import { toast } from "react-toastify";

const Login = () => {
    const [vendorLogin, { isLoading: sendingOtp }] = useVendorLoginMutation();
    const [verifyLoginOtp, { isLoading: verifyingOtp }] = useVerifyLoginOtpMutation();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            hotelNumber: "",
            otp: "",
            shopId: "",
            otpSent: false,
        },
    });

    const otpSent = watch("otpSent");

    const handleSendOtp = async (data) => {
        try {
            const res = await vendorLogin({ hotelNumber: data.hotelNumber }).unwrap();
            setValue("shopId", res.shopId || "");
            setValue("otpSent", true);
            toast.success("OTP sent successfully!");
        } catch (err) {
            toast.error(err?.data?.message || "Failed to send OTP");
        }
    };

    const handleVerifyOtp = async (data) => {
        try {
            const res = await verifyLoginOtp({
                hotelNumber: data.hotelNumber,
                otp: data.otp,
                shopId: data.shopId,
            }).unwrap();

            toast.success("Login successful!");
            navigate("/dashboard");
        } catch (err) {
            toast.error(err?.data?.message || "OTP verification failed");
        }
    };

    return (
        <div
            className="
                relative flex items-center justify-center 
                h-screen md:h-screen px-4 sm:px-6 
                bg-cover bg-center overflow-hidden
            "
            style={{ backgroundImage: `url(${background})` }}
        >
            {/* Black Overlay */}
            <div className="absolute inset-0 bg-black/60"></div>

            {/* 🔸 Top Right Circle (Hidden on Mobile & Tablet) */}
            <div className="hidden lg:block absolute top-24 right-20 rotate-[-45deg] translate-x-1/3 -translate-y-1/3 z-10">
                <div
                    className="w-[465px] h-[465px] rounded-full flex items-center justify-center"
                    style={{ background: "#FE9611B8" }}
                >
                    <div className="w-[300px] h-[300px] rounded-full overflow-hidden">
                        <img src={food1} alt="Food" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>

            {/* 🔸 Bottom Left Circle (Hidden on Mobile & Tablet) */}
            <div className="hidden lg:block absolute bottom-0 left-0 rotate-[-45deg] -translate-x-1/3 translate-y-1/3 z-10">
                <div
                    className="w-[465px] h-[465px] rounded-full flex items-center justify-center"
                    style={{ background: "#FE9611B8" }}
                >
                    <div className="w-[299px] h-[298px] rounded-full overflow-hidden">
                        <img src={food1} alt="Food" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>

            {/* Logo */}
            <div className="absolute top-10 sm:top-16 flex flex-col items-center z-20 w-full">
                <img
                    src={indianFast}
                    alt="Indian Fast Logo"
                    className="w-40 sm:w-48 md:w-56 lg:w-[19%]"
                />
            </div>

            {/* 🔸 Login Box */}
            <div
                className="
                    relative z-20 mt-32 sm:mt-40 bg-[#1E1E1E]/90 text-white 
                    px-6 py-8 sm:px-8 sm:py-10 rounded-2xl shadow-lg 
                    w-full sm:w-[70%] md:w-[50%] lg:w-[27%] 
                    backdrop-blur-sm mx-4
                "
            >
                <form
                    onSubmit={otpSent ? handleSubmit(handleVerifyOtp) : handleSubmit(handleSendOtp)}
                >
                    {/* Mobile Number */}
                    <input
                        type="text"
                        placeholder="Mobile Number"
                        {...register("hotelNumber", {
                            required: "Mobile number is required",
                            pattern: {
                                value: /^[0-9]{10}$/,
                                message: "Enter valid 10-digit number",
                            },
                        })}
                        className="w-full p-3 mb-3 mt-8 sm:mt-11 border-2 bg-white border-[#FE9611] rounded-md focus:outline-none text-black"
                    />
                    {errors.hotelNumber && (
                        <p className="text-red-400 text-sm mb-2">{errors.hotelNumber.message}</p>
                    )}

                    {/* OTP */}
                    {otpSent && (
                        <>
                            <input
                                type="text"
                                placeholder="Enter OTP"
                                {...register("otp", {
                                    required: "OTP is required",
                                    pattern: {
                                        value: /^[0-9]{4,6}$/,
                                        message: "Enter valid OTP",
                                    },
                                })}
                                className="w-full p-3 mb-3 border-2 bg-white border-[#FE9611] rounded-md focus:outline-none text-black"
                            />
                            {errors.otp && (
                                <p className="text-red-400 text-sm mb-2">{errors.otp.message}</p>
                            )}
                        </>
                    )}

                    {/* Hidden Fields */}
                    <input type="hidden" {...register("shopId")} />
                    <input type="hidden" {...register("otpSent")} />

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={sendingOtp || verifyingOtp}
                        className="w-full bg-gradient-to-r mt-6 sm:mt-7 from-[#FE9611] to-[#FF9F03] 
                        text-white font-semibold py-3 rounded-md transition-all 
                        hover:opacity-90 disabled:opacity-70"
                    >
                        {otpSent
                            ? verifyingOtp
                                ? "Verifying..."
                                : "Verify OTP"
                            : sendingOtp
                                ? "Sending OTP..."
                                : "Send OTP"}
                    </button>
                </form>

                <p className="text-center text-sm mt-6 text-gray-300">
                    Not registered yet?{" "}
                    <span
                        onClick={() => navigate("/register")}
                        className="text-[#FE9611] cursor-pointer font-semibold"
                    >
                        Register
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;
