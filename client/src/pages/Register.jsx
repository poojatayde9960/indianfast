import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import { useVendorRegisterMutation, useVerifyPaymentMutation } from "../redux/apis/vendorApi";
import background from "/background.jpg";
import indianFast from "/indianFast.png";
import food1 from "/food1.png";
import { Icon } from "@iconify/react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useRegistretionFessQuery } from "../redux/apis/setting";


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
    hotelCity: yup.string().required("Hotel City is required"),
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
    const [apiResponse, setApiResponse] = useState(null);
    const [verifyPayment] = useVerifyPaymentMutation();
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
                fetchAddress(latitude, longitude);
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
        setValue,
        watch
    } = useForm({
        resolver: yupResolver(schema),
        mode: "onBlur",
    });
    // 🔹 Watch file inputs
    const hotelImageFile = watch("hotelImage");
    const gstImageFile = watch("enterGSTImage");
    const shopLicenseImageFile = watch("shopActLicenseImage");
    const foodLicenseImageFile = watch("foodDrugLicenseImage");
    const clerkLicenseImageFile = watch("clerkLicenseImage");

    const fetchAddress = async (lat, lon) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
            );
            const data = await response.json();
            if (data) {
                if (data.display_name) setValue("hotelAddress", data.display_name);
                if (data.address?.city) setValue("hotelCity", data.address.city);
                else if (data.address?.town) setValue("hotelCity", data.address.town);
                else if (data.address?.village) setValue("hotelCity", data.address.village);
            }
        } catch (error) {
            console.error("Error fetching address:", error);
        }
    };

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLocation({
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                });
                fetchAddress(pos.coords.latitude, pos.coords.longitude);
            },
            (err) => console.warn("Location access denied:", err)
        );
    }, []);

    const handlePayment = () => {
        const fee = RegistretionFessData?.data?.vendorOnboardingFee || 0;

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY,
            amount: fee * 100,
            currency: "INR",
            name: "Indian Fast Food",
            description: "Vendor Registration Fee",
            image: indianFast,
            order_id: apiResponse?.shop?.razorpayOrderId, // 

            handler: async function (response) {
                try {
                    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;
                    console.log(response);

                    const res = await verifyPayment({
                        razorpayOrderId: razorpay_order_id,
                        razorpay_payment_id: razorpay_payment_id,
                        razorpay_signature: razorpay_signature,
                    }).unwrap();

                    console.log("Payment Verified ✅", res);
                    alert("Payment Verified Successfully!");
                    navigate("/login");
                } catch (err) {
                    console.error("Payment Verification Failed ❌", err);
                    alert("Payment Verification Failed!");
                }
            },
            prefill: {
                name: apiResponse?.shop?.ownerName,
                email: apiResponse?.shop?.ownerEmail,
                contact: apiResponse?.shop?.ownerNumber,
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
            const formData = new FormData();

            Object.entries(values).forEach(([key, value]) => {
                if (value instanceof FileList) formData.append(key, value[0]);
                else formData.append(key, value);
            });

            formData.append("latitude", location.latitude);
            formData.append("longitude", location.longitude);

            const res = await vendorRegister(formData).unwrap();
            console.log("RESPONSE 👉", res); //

            setApiResponse(res);
            setShowPaymentModal(true);

        } catch (err) {
            console.error("Registration Failed 👉", err);
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

    return <>
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
                        <input {...register("hotelArea")} placeholder="Hotel hotelArea" className={inputClass("hotelArea")} />
                        <div className="relative">
                            <input {...register("hotelNumber")} maxLength={10} type="tel" placeholder="Hotel Phone Number" className={inputClass("hotelNumber")} />
                            {errors.hotelNumber && (
                                <p className="absolute -bottom-5 left-0 text-red-500 text-xs">{errors.hotelNumber.message}</p>
                            )}
                        </div>
                        <input
                            {...register("hotelCity")}
                            placeholder="Hotel City"
                            className={inputClass("hotelCity")}
                        />

                        {/* Hotel Image */}
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-[#5E5E5E] mb-1">
                                Upload Hotel Image
                            </label>
                            <label
                                htmlFor="hotelImage"
                                className={`w-full border border-dashed rounded-md flex items-center justify-center px-4 py-[14px] text-[15px] bg-white cursor-pointer transition
    ${hotelImageFile?.length ? "border-green-500 text-green-600" : "border-[#B4B4B4CC] text-[#5E5E5E]"}
  `}
                            >
                                <Icon
                                    icon={hotelImageFile?.length ? "mdi:check-circle" : "mdi:upload"}
                                    className="w-6 h-6 mr-2"
                                />
                                <span>
                                    {hotelImageFile?.length
                                        ? `Image selected: ${hotelImageFile[0].name}`
                                        : "Upload Hotel Image"}
                                </span>

                                <input
                                    id="hotelImage"
                                    type="file"
                                    {...register("hotelImage")}
                                    className="hidden"
                                />
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
                            <input
                                {...register("enterGSTNumber")}
                                placeholder="GST Number"
                                className={inputClass("enterGSTNumber")}
                            />

                            <label
                                htmlFor="enterGSTImage"
                                className={`flex flex-col items-center justify-center w-full h-14 mt-2 border-2 border-dashed rounded-md cursor-pointer bg-white transition
      ${gstImageFile?.length
                                        ? "border-green-500 text-green-600"
                                        : "border-gray-400 text-gray-600 hover:bg-gray-100"}
    `}
                            >
                                <Icon
                                    icon={gstImageFile?.length ? "mdi:check-circle-outline" : "mdi:upload-outline"}
                                    className="text-xl mb-[2px]"
                                />

                                <span className="text-sm">
                                    {gstImageFile?.length
                                        ? `File selected: ${gstImageFile[0].name}`
                                        : "Upload GST Certificate"}
                                </span>

                                <input
                                    id="enterGSTImage"
                                    type="file"
                                    {...register("enterGSTImage")}
                                    className="hidden"
                                />
                            </label>
                        </div>


                        <div>
                            <input
                                {...register("shopActLicenseNo")}
                                placeholder="Shop License No"
                                className={inputClass("shopActLicenseNo")}
                            />

                            <label
                                htmlFor="shopActLicenseImage"
                                className={`flex flex-col items-center justify-center w-full h-14 mt-2 border-2 border-dashed rounded-md cursor-pointer bg-white transition
      ${shopLicenseImageFile?.length
                                        ? "border-green-500 text-green-600"
                                        : "border-gray-400 text-gray-600 hover:bg-gray-100"}
    `}
                            >
                                <Icon
                                    icon={shopLicenseImageFile?.length ? "mdi:check-circle-outline" : "mdi:upload-outline"}
                                    className="text-xl mb-[2px]"
                                />

                                <span className="text-sm">
                                    {shopLicenseImageFile?.length
                                        ? `File selected: ${shopLicenseImageFile[0].name}`
                                        : "Upload Shop License File"}
                                </span>

                                <input
                                    id="shopActLicenseImage"
                                    type="file"
                                    {...register("shopActLicenseImage")}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        <div>
                            <input
                                {...register("foodDrugLicenseNo")}
                                placeholder="Food License No"
                                className={inputClass("foodDrugLicenseNo")}
                            />

                            <label
                                htmlFor="foodDrugLicenseImage"
                                className={`flex flex-col items-center justify-center w-full h-14 mt-2 border-2 border-dashed rounded-md cursor-pointer bg-white transition
      ${foodLicenseImageFile?.length
                                        ? "border-green-500 text-green-600"
                                        : "border-gray-400 text-gray-600 hover:bg-gray-100"}
    `}
                            >
                                <Icon
                                    icon={foodLicenseImageFile?.length ? "mdi:check-circle-outline" : "mdi:upload-outline"}
                                    className="text-xl mb-[2px]"
                                />

                                <span className="text-sm">
                                    {foodLicenseImageFile?.length
                                        ? `File selected: ${foodLicenseImageFile[0].name}`
                                        : "Upload Food License File"}
                                </span>

                                <input
                                    id="foodDrugLicenseImage"
                                    type="file"
                                    {...register("foodDrugLicenseImage")}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        <div>
                            <input
                                {...register("clerkLicenseNo")}
                                placeholder="Clerk License No"
                                className={inputClass("clerkLicenseNo")}
                            />

                            <label
                                htmlFor="clerkLicenseImage"
                                className={`flex flex-col items-center justify-center w-full h-14 mt-2 border-2 border-dashed rounded-md cursor-pointer bg-white transition
      ${clerkLicenseImageFile?.length
                                        ? "border-green-500 text-green-600"
                                        : "border-gray-400 text-gray-600 hover:bg-gray-100"}
    `}
                            >
                                <Icon
                                    icon={clerkLicenseImageFile?.length ? "mdi:check-circle-outline" : "mdi:upload-outline"}
                                    className="text-xl mb-[2px]"
                                />

                                <span className="text-sm">
                                    {clerkLicenseImageFile?.length
                                        ? `File selected: ${clerkLicenseImageFile[0].name}`
                                        : "Upload Clerk License File"}
                                </span>

                                <input
                                    id="clerkLicenseImage"
                                    type="file"
                                    {...register("clerkLicenseImage")}
                                    className="hidden"
                                />
                            </label>
                        </div>




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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-white text-black rounded-2xl w-[95%] md:w-[700px] max-h-[85vh] overflow-y-auto shadow-xl p-6 md:p-8 relative">
                        <h3 className="text-3xl font-bold mb-6 text-center text-[#FE9611]">
                            Registration Successful ✅
                        </h3>

                        {/* Vendor & Hotel Details */}
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    ["Vendor ID", apiResponse?.shop?._id],
                                    ["Status", apiResponse?.message],
                                    ["Owner Name", apiResponse?.shop?.ownerName],
                                    ["Owner Email", apiResponse?.shop?.ownerEmail],
                                    ["Owner Address", apiResponse?.shop?.ownerAddress],
                                    ["Owner Number", apiResponse?.shop?.ownerNumber],
                                    ["Hotel Name", apiResponse?.shop?.hotelName],
                                    ["Hotel Email", apiResponse?.shop?.hotelEmail],
                                    ["Hotel Address", apiResponse?.shop?.hotelAddress],
                                    ["Hotel Area", apiResponse?.shop?.hotelArea],
                                    ["Hotel Number", apiResponse?.shop?.hotelNumber],
                                    ["Hotel Availability", apiResponse?.shop?.hotelAvable],
                                    ["Hotel Type", apiResponse?.shop?.hotelType],
                                    ["GST Number", apiResponse?.shop?.enterGSTNumber],
                                    ["Shop License No", apiResponse?.shop?.shopActLicenseNo],
                                    ["Food License No", apiResponse?.shop?.foodDrugLicenseNo],
                                    ["Clerk License No", apiResponse?.shop?.clerkLicenseNo],
                                    ["Latitude", apiResponse?.shop?.locations?.latitude],
                                    ["Longitude", apiResponse?.shop?.locations?.longitude],
                                    ["Amount", `₹${apiResponse?.shop?.amount}`],
                                ].map(([label, value]) => (
                                    <p key={label} className="text-gray-700 hover:text-gray-900 transition-colors">
                                        <span className="font-semibold">{label}:</span> {value || "-"}
                                    </p>
                                ))}
                            </div>

                            {/* Images */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                {[
                                    ["Hotel Image", apiResponse?.shop?.hotelImage],
                                    ["GST Certificate", apiResponse?.shop?.enterGSTImage],
                                    ["Shop License", apiResponse?.shop?.shopActLicenseImage],
                                    ["Food License", apiResponse?.shop?.foodDrugLicenseImage],
                                    ["Clerk License", apiResponse?.shop?.clerkLicenseImage],
                                ].map(([label, src]) =>
                                    src ? (
                                        <div key={label} className="flex flex-col items-center p-2 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                            <p className="text-sm font-semibold mb-2 text-gray-600">{label}</p>
                                            <img
                                                src={src}
                                                alt={label}
                                                className="w-full h-28 object-cover rounded-lg border border-gray-200"
                                            />
                                        </div>
                                    ) : null
                                )}
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-center gap-6 mt-6">
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                            >
                                Close
                            </button>
                            <button
                                onClick={handlePayment}
                                className="px-6 py-2 bg-gradient-to-r from-[#FE9611] to-[#FF9F03] text-white rounded-lg shadow hover:opacity-90 transition"
                            >
                                Pay Now
                            </button>
                        </div>

                        {/* Optional: Close X button */}
                        <button
                            onClick={() => setShowPaymentModal(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition text-xl font-bold"
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}



        </div>
    </>
};

export default Register;
