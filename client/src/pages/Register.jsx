import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import { useVendorRegisterMutation } from "../redux/apis/vendorApi";
import background from "/background.jpg";
import indianFast from "/indianFast.png";
import food1 from "/food1.png";
import { Icon } from "@iconify/react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useRegistretionFessQuery } from "../redux/apis/setting";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const schema = yup.object().shape({
    ownerName: yup.string().required("Owner Name is required"),
    ownerEmail: yup.string().email("Invalid email").required("Email is required"),
    ownerAddress: yup.string().required("Owner Address is required"),
    ownerNumber: yup
        .string()
        .matches(/^[0-9]{10}$/, "Enter valid 10-digit number")
        .required("Owner Number is required"),

    hotelName: yup.string().required("Hotel Name is required"),
    hotelEmail: yup.string().email("Invalid email").required("Hotel Email is required"),
    hotelAddress: yup.string().required("Hotel Address is required"),
    hotelNumber: yup
        .string()
        .matches(/^[0-9]{10}$/, "Enter valid 10-digit number")
        .required("Hotel Number is required"),
    hotelImage: yup.mixed().required("Hotel Image is required"),
    hotelAvable: yup.string().required("Hotel Availability is required"),
    hotelType: yup.string().required("Hotel Type is required"),

    enterGSTNumber: yup.string().required("GST Number is required"),
    shopActLicenseNo: yup.string().required("Shop License No is required"),
    foodDrugLicenseNo: yup.string().required("Food License No is required"),
    clerkLicenseNo: yup.string().required("Clerk License No is required"),

    enterGSTImage: yup.mixed().required("GST Certificate is required"),
    shopActLicenseImage: yup.mixed().required("Shop License File is required"),
    foodDrugLicenseImage: yup.mixed().required("Food License File is required"),
    clerkLicenseImage: yup.mixed().required("Clerk License File is required"),
});

const Register = () => {

    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [formData, setFormData] = useState(null);
    const { data: RegistretionFessData } = useRegistretionFessQuery();
    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            setMessage("❌ Geolocation is not supported by your browser.");
            return;
        }

        setLoading(true);
        setMessage("Fetching your location...");

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude });
                setMessage("✅ Location fetched successfully!");
                setLoading(false);
            },
            (error) => {
                console.error("Error fetching location:", error);
                setMessage("❌ Failed to get your location. Please enable GPS.");
                setLoading(false);
            }
        );
    };
    const [
        vendorRegister,
        { isLoading, isSuccess, isError, error, data },
    ] = useVendorRegisterMutation();

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
        mode: "onBlur",
    });

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLocation({
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                });
            },
            (err) => console.warn("Location access denied:", err)
        );
    }, []);

    const handlePayment = () => {
        const fee = RegistretionFessData?.data?.vendorOnboardingFee || 0;
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_1DP5mmOlF5G5ag",
            amount: fee * 100, // Amount in paisa
            currency: "INR",
            name: "Indian Fast Food",
            description: "Vendor Registration Fee",
            image: indianFast,
            handler: async function (response) {
                try {
                    const finalFormData = new FormData();
                    // Append original form data
                    for (const pair of formData.entries()) {
                        finalFormData.append(pair[0], pair[1]);
                    }
                    // Append payment details
                    finalFormData.append("paymentId", response.razorpay_payment_id);

                    const res = await vendorRegister(finalFormData).unwrap();
                    console.log("Registration Success:", res);
                    toast.success("Payment Successful! Registration Complete.");
                    reset();
                    setShowPaymentModal(false);
                    navigate("/login");
                } catch (error) {
                    console.error("Registration Failed:", error);
                    toast.error("Registration failed. Try again.");
                }
            },
            prefill: {
                name: formData?.get("ownerName"),
                email: formData?.get("ownerEmail"),
                contact: formData?.get("ownerNumber"),
            },
            theme: {
                color: "#FE9611",
            },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();
    };

    const onSubmit = async (values) => {
        try {
            const data = new FormData();
            Object.entries(values).forEach(([key, value]) => {
                if (value instanceof FileList) data.append(key, value[0]);
                else data.append(key, value);
            });

            // append location
            data.append("latitude", location.latitude);
            data.append("longitude", location.longitude);

            setFormData(data);
            setShowPaymentModal(true);
        } catch (error) {
            console.error("Form preparation failed:", error);
        }
    };

    const inputClass = (field) =>
        clsx(
            "w-full border text-black rounded-md p-3 placeholder:text-[15px] bg-white focus:outline-none",
            {
                "border-gray-300": !errors[field],
                "border-red-500": errors[field],
            }
        );

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-cover bg-center overflow-hidden"
            style={{ backgroundImage: `url(${background})` }}
        >

            <div className="absolute inset-0 bg-black/60"></div>

            <div className="hidden lg:block absolute top-24 right-20 rotate-[-45deg] translate-x-1/3 -translate-y-1/3 z-10">
                <div
                    className="w-[300px] h-[300px] xl:w-[465px] xl:h-[465px] rounded-full flex items-center justify-center"
                    style={{ background: "#FE9611B8" }}
                >
                    <div className="w-[200px] h-[200px] xl:w-[300px] xl:h-[300px] rounded-full overflow-hidden">
                        <img src={food1} alt="Food" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>

            <div className="hidden lg:block absolute bottom-0 left-0 rotate-[-45deg] -translate-x-1/3 translate-y-1/3 z-10">
                <div
                    className="w-[300px] h-[300px] xl:w-[465px] xl:h-[465px] rounded-full flex items-center justify-center"
                    style={{ background: "#FE9611B8" }}
                >
                    <div className="w-[200px] h-[200px] xl:w-[299px] xl:h-[298px] rounded-full overflow-hidden">
                        <img src={food1} alt="Food" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>

            {/* Logo */}
            <div className="absolute top-4 md:top-8 lg:top-12 flex flex-col items-center z-20">
                <img src={indianFast} alt="Indian Fast Logo" className="w-[120px] md:w-[150px] lg:w-[19%]" />
            </div>

            {/* Form */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="relative z-20 mt-16 md:mt-20 lg:mt-23 bg-[#1E1E1E]/90 text-white px-4 py-6 md:px-8 md:py-8 lg:px-10 lg:py-10 rounded-3xl shadow-lg w-[90%] md:w-[80%] lg:w-[52%] h-[80vh] md:h-[75vh] lg:h-[65vh] backdrop-blur-sm flex flex-col"
            >
                <h2 className="text-2xl font-semibold text-center mb-6">
                    Vendor Registration
                </h2>

                <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#FE9611] scrollbar-track-transparent">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pb-4">
                        {/* Owner Info */}
                        <input {...register("ownerName")} placeholder="Owner Name" className={inputClass("ownerName")} />
                        <input {...register("ownerEmail")} placeholder="Owner Email" className={inputClass("ownerEmail")} />
                        <input {...register("ownerAddress")} placeholder="Owner Address" className={inputClass("ownerAddress")} />
                        <div className="relative">
                            <input {...register("ownerNumber")} maxLength={10} type="tel" placeholder="Owner Number" className={inputClass("ownerNumber")} />
                            {errors.ownerNumber && (
                                <p className="absolute -bottom-5 left-0 text-red-500 text-xs">{errors.ownerNumber.message}</p>
                            )}
                        </div>

                        {/* Hotel Info */}
                        <input {...register("hotelName")} placeholder="Hotel Name" className={inputClass("hotelName")} />
                        <input {...register("hotelEmail")} placeholder="Hotel Email" className={inputClass("hotelEmail")} />
                        <input {...register("hotelAddress")} placeholder="Hotel Address" className={inputClass("hotelAddress")} />
                        <div className="relative">
                            <input {...register("hotelNumber")} maxLength={10} type="tel" placeholder="Hotel Phone Number" className={inputClass("hotelNumber")} />
                            {errors.hotelNumber && (
                                <p className="absolute -bottom-5 left-0 text-red-500 text-xs">{errors.hotelNumber.message}</p>
                            )}
                        </div>

                        {/* Hotel Image */}
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-[#5E5E5E] mb-1">
                                Upload Hotel Image
                            </label>
                            <label
                                htmlFor="hotelImage"
                                className="w-full border border-dashed border-[#B4B4B4CC] bg-[#FFFFFF] rounded-md flex items-center justify-center px-4 py-[14px] text-[15px] text-[#5E5E5E] cursor-pointer   transition"
                            >
                                <Icon icon="mdi:upload" className="text-[#B4B4B4CC] w-6 h-6 mr-2" />
                                <span className="text-[#B4B4B4CC]">Upload Hotel Image</span>
                                <input id="hotelImage" type="file" {...register("hotelImage")} className="hidden" />
                            </label>
                        </div>


                        {/* Hotel Availability & Type */}
                        <select {...register("hotelAvable")} className={inputClass("hotelAvable")}>
                            <option value="">Select Availability</option>
                            <option value="Open">Open</option>
                            <option value="Closed">Closed</option>
                        </select>

                        <select {...register("hotelType")} className={inputClass("hotelType")}>
                            <option value="">Select Hotel Type</option>
                            <option value="Veg">Veg</option>
                            <option value="Non-Veg">Non-Veg</option>
                            <option value="Both">Both</option>
                        </select>

                        {/* License Inputs */}
                        <div>
                            <input {...register("enterGSTNumber")} placeholder="GST Number" className={inputClass("enterGSTNumber")} />
                            <label
                                htmlFor="enterGSTImage"
                                className="flex flex-col items-center justify-center w-full h-14 mt-2 border-2 border-dashed border-gray-400 rounded-md cursor-pointer bg-white text-gray-600 hover:bg-gray-100 transition"
                            >
                                <Icon icon="mdi:upload-outline" className="text-xl mb-[2px]" />
                                <span className="text-sm">Upload GST Certificate</span>
                                <input id="enterGSTImage" type="file" {...register("enterGSTImage")} className="hidden" />
                            </label>
                        </div>

                        <div>
                            <input {...register("shopActLicenseNo")} placeholder="Shop License No" className={inputClass("shopActLicenseNo")} />
                            <label
                                htmlFor="shopActLicenseImage"
                                className="flex flex-col items-center justify-center w-full h-14 mt-2 border-2 border-dashed border-gray-400 rounded-md cursor-pointer bg-white text-gray-600 hover:bg-gray-100 transition"
                            >
                                <Icon icon="mdi:upload-outline" className="text-xl mb-[2px]" />
                                <span className="text-sm">Upload Shop License File</span>
                                <input id="shopActLicenseImage" type="file" {...register("shopActLicenseImage")} className="hidden" />
                            </label>
                        </div>

                        <div>
                            <input {...register("foodDrugLicenseNo")} placeholder="Food License No" className={inputClass("foodDrugLicenseNo")} />
                            <label
                                htmlFor="foodDrugLicenseImage"
                                className="flex flex-col items-center justify-center w-full h-14 mt-2 border-2 border-dashed border-gray-400 rounded-md cursor-pointer bg-white text-gray-600 hover:bg-gray-100 transition"
                            >
                                <Icon icon="mdi:upload-outline" className="text-xl mb-[2px]" />
                                <span className="text-sm">Upload Food License File</span>
                                <input id="foodDrugLicenseImage" type="file" {...register("foodDrugLicenseImage")} className="hidden" />
                            </label>
                        </div>

                        <div>
                            <input {...register("clerkLicenseNo")} placeholder="Clerk License No" className={inputClass("clerkLicenseNo")} />
                            <label
                                htmlFor="clerkLicenseImage"
                                className="flex flex-col items-center justify-center w-full h-14 mt-2 border-2 border-dashed border-gray-400 rounded-md cursor-pointer bg-white text-gray-600 hover:bg-gray-100 transition"
                            >
                                <Icon icon="mdi:upload-outline" className="text-xl mb-[2px]" />
                                <span className="text-sm">Upload Clerk License File</span>
                                <input id="clerkLicenseImage" type="file" {...register("clerkLicenseImage")} className="hidden" />
                            </label>
                        </div>

                        {/* Location Info */}
                        {/* <div className="col-span-2 grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                value={location.latitude || ""}
                                readOnly
                                placeholder="Latitude (auto)"
                                className="border text-black rounded-md p-3 bg-gray-100"
                            />
                            <input
                                type="text"
                                value={location.longitude || ""}
                                readOnly
                                placeholder="Longitude (auto)"
                                className="border text-black rounded-md p-3 bg-gray-100"
                            />
                        </div> */}

                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-[#5E5E5E] mb-2">
                                Location
                            </label>

                            <button
                                type="button"
                                onClick={handleGetLocation}
                                disabled={loading}
                                className={`mb-3 px-4 py-2 rounded-md text-white ${loading ? "bg-gray-400" : "bg-[#FF9F03]"
                                    }`}
                            >
                                {loading ? "Detecting..." : "📍 Use My Location"}
                            </button>

                            {message && (
                                <p
                                    className={`text-sm mb-3 ${message.startsWith("✅")
                                        ? "text-green-600"
                                        : message.startsWith("❌")
                                            ? "text-red-600"
                                            : "text-gray-600"
                                        }`}
                                >
                                    {message}
                                </p>
                            )}

                            {location.latitude && location.longitude ? (
                                <MapContainer
                                    center={[location.latitude, location.longitude]}
                                    zoom={15}
                                    style={{ height: "250px", width: "100%", borderRadius: "8px" }}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution="© OpenStreetMap contributors"
                                    />
                                    <Marker position={[location.latitude, location.longitude]}>
                                        <Popup>Your Current Location 📍</Popup>
                                    </Marker>
                                </MapContainer>
                            ) : (
                                <p className="text-gray-500 text-sm mt-2">(No location detected yet)</p>
                            )}
                        </div>

                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r mt-4 from-[#FE9611] to-[#FF9F03] text-white font-semibold py-3 rounded-md transition-all hover:opacity-90"
                >
                    Register
                </button>
            </form>

            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="bg-white text-black p-6 rounded-lg shadow-xl w-[90%] md:w-[400px]">
                        <h3 className="text-xl font-bold mb-4 text-center">Registration Fee</h3>
                        <p className="text-center mb-6 text-gray-700">
                            To complete your registration, you need to pay a one-time fee of:
                            <br />
                            <span className="text-2xl font-bold text-[#FE9611]">
                                ₹{RegistretionFessData?.data?.vendorOnboardingFee || 0}
                            </span>
                        </p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePayment}
                                className="px-6 py-2 rounded-md bg-[#FE9611] text-white font-semibold hover:bg-[#e0850f] transition"
                            >
                                Yes, Pay & Register
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Register;
