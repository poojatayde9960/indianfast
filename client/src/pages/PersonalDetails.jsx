import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import clsx from "clsx";
import { useGetProfileQuery } from "../redux/apis/vendorApi";
import { useSelector } from "react-redux";

const PersonalDetails = () => {
    const shopId = useSelector((state) => state.auth.shopId);
    const { data, isLoading, isError } = useGetProfileQuery(shopId);
    const formik = useFormik({
        initialValues: {
            ownerName: "",
            ownerEmail: "",
            fullAddress: "",
            mobileNumber: "",
            hotelName: "",
            hotelEmail: "",
            hotelAddress: "",
            hotelPhone: "",
            areaName: "",
            city: "",
            pinCode: "",
            gstNumber: "",
            shopLicense: "",
            foodLicense: "",
            clerkLicense: "",
        },
        validationSchema: yup.object({
            ownerName: yup.string().required("Owner Name is required"),
            ownerEmail: yup.string().email("Invalid email").required("Email is required"),
            fullAddress: yup.string().required("Full Address is required"),
            mobileNumber: yup
                .string()
                .matches(/^[0-9]{10}$/, "Enter valid 10-digit number")
                .required("Mobile Number is required"),
            hotelName: yup.string().required("Hotel Name is required"),
            hotelEmail: yup.string().email("Invalid email").required("Hotel Email is required"),
            hotelAddress: yup.string().required("Hotel Address is required"),
            hotelPhone: yup.string().required("Hotel Phone Number is required"),
            areaName: yup.string().required("Area Name is required"),
            city: yup.string().required("City is required"),
            pinCode: yup
                .string()
                .matches(/^[0-9]{6}$/, "Enter valid 6-digit Pin Code")
                .required("Pin Code is required"),
            gstNumber: yup.string().required("GST Number is required"),
            shopLicense: yup.string().required("Shop License is required"),
            foodLicense: yup.string().required("Food License is required"),
            clerkLicense: yup.string().required("Clerk License is required"),
        }),
        onSubmit: (values, { resetForm }) => {
            console.log("Form Data:", values);
            resetForm();
        },
    });
    useEffect(() => {
        if (data?.shop) {
            const s = data.shop;

            formik.setValues({
                ownerName: s.ownerName || "",
                ownerEmail: s.ownerEmail || "",
                fullAddress: s.ownerAddress || "",
                mobileNumber: s.ownerNumber || "",
                hotelName: s.hotelName || "",
                hotelEmail: s.hotelEmail || "",
                hotelAddress: s.hotelAddress || "",
                hotelPhone: s.hotelNumber || "",

                areaName: s.locations?.area || "",
                city: s.locations?.city || "",
                pinCode: s.locations?.pincode || "",

                gstNumber: s.enterGSTNumber || "",
                shopLicense: s.shopActLicenseNo || "",
                foodLicense: s.foodDrugLicenseNo || "",
                clerkLicense: s.clerkLicenseNo || "",
            });
        }
    }, [data]);


    const handleClass = (field) =>
        clsx(
            "w-full border text-black rounded-md p-5 placeholder:text-[16px] placeholder-[#A0A0A0] focus:outline-none",
            {
                "border-[#CFCFCF]": !formik.touched[field],
                "border-red-500": formik.touched[field] && formik.errors[field],
                "border-green-500": formik.touched[field] && !formik.errors[field],
            }
        );

    return <>
        {/* <pre className="text-black mt-60">{JSON.stringify(data, null, 2)}</pre> */}

        <div className="p-4 sm:p-5 md:p-6 bg-[#F5F5F5] mt-20 min-h-[calc(100vh-80px)] md:h-[calc(100vh-80px)] overflow-y-auto transition-all duration-500">
            <h2 className="text-3xl font-semibold text-black mb-4">Owner Details</h2>

            <form onSubmit={formik.handleSubmit}>
                <div className="bg-white p-4 m-3 md:p-8 md:m-5 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Owner Name */}
                        <div>
                            <label className="block text-[#1E1E1E] text-[17px] mb-2 font-medium">
                                Owner Name
                            </label>
                            <input
                                type="text"
                                name="ownerName"
                                placeholder="Durgesh Nai"
                                className={handleClass("ownerName")}
                                {...formik.getFieldProps("ownerName")}
                                readOnly
                            />
                            {formik.touched.ownerName && formik.errors.ownerName && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.ownerName}</p>
                            )}
                        </div>

                        {/* Owner Email */}
                        <div>
                            <label className="block text-[#1E1E1E] text-[17px] mb-2 font-medium">
                                Owner Email
                            </label>
                            <input
                                type="email"
                                name="ownerEmail"
                                placeholder="Durgeshnai0123@gmail.com"
                                className={handleClass("ownerEmail")}
                                {...formik.getFieldProps("ownerEmail")}
                                readOnly
                            />
                            {formik.touched.ownerEmail && formik.errors.ownerEmail && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.ownerEmail}</p>
                            )}
                        </div>

                        {/* Full Address */}
                        <div>
                            <label className="block text-[#1E1E1E] text-[17px] mb-2 font-medium">
                                Full Address
                            </label>
                            <input
                                type="text"
                                name="fullAddress"
                                placeholder="123– Golden City Center, Near Prozone Mall, Chh. Sambhaji Nagar–431001"
                                className={handleClass("fullAddress")}
                                {...formik.getFieldProps("fullAddress")}
                                readOnly
                            />
                            {formik.touched.fullAddress && formik.errors.fullAddress && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.fullAddress}</p>
                            )}
                        </div>

                        {/* Mobile Number */}
                        <div>
                            <label className="block text-[#1E1E1E] text-[17px] mb-2 font-medium">
                                Mobile Number
                            </label>
                            <input
                                type="text"
                                name="mobileNumber"
                                placeholder="9876543210"
                                className={handleClass("mobileNumber")}
                                {...formik.getFieldProps("mobileNumber")}
                                readOnly
                            />
                            {formik.touched.mobileNumber && formik.errors.mobileNumber && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.mobileNumber}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* HOTEL DETAILS */}
                <h2 className="text-2xl font-semibold m-3 md:m-5 text-black mt-10 mb-4">Hotel Details</h2>
                <div className="bg-white p-4 m-3 md:p-8 md:m-5 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Hotel Name */}
                        <div>
                            <label className="block text-[#1E1E1E] text-[17px] mb-2 font-medium">
                                Hotel Name
                            </label>
                            <input
                                type="text"
                                name="hotelName"
                                placeholder="Grand Plaza Hotel"
                                className={handleClass("hotelName")}
                                {...formik.getFieldProps("hotelName")}
                                readOnly
                            />
                            {formik.touched.hotelName && formik.errors.hotelName && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.hotelName}</p>
                            )}
                        </div>

                        {/* Hotel Email */}
                        <div>
                            <label className="block text-[#1E1E1E] text-[17px] mb-2 font-medium">
                                Hotel Email
                            </label>
                            <input
                                type="email"
                                name="hotelEmail"
                                placeholder="info@grandplaza.com"
                                className={handleClass("hotelEmail")}
                                {...formik.getFieldProps("hotelEmail")}
                                readOnly
                            />
                            {formik.touched.hotelEmail && formik.errors.hotelEmail && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.hotelEmail}</p>
                            )}
                        </div>

                        {/* Hotel Address */}
                        <div>
                            <label className="block text-[#1E1E1E] text-[17px] mb-2 font-medium">
                                Hotel Address
                            </label>
                            <input
                                type="text"
                                name="hotelAddress"
                                placeholder="123– Golden City Center, Near Prozone Mall, Chh. Sambhaji Nagar–431001"
                                className={handleClass("hotelAddress")}
                                {...formik.getFieldProps("hotelAddress")}
                                readOnly
                            />
                            {formik.touched.hotelAddress && formik.errors.hotelAddress && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.hotelAddress}</p>
                            )}
                        </div>

                        {/* Hotel Area */}
                        <div>
                            <label className="block text-[#1E1E1E] text-[17px] mb-2 font-medium">
                                Hotel Area
                            </label>
                            <input
                                type="text"
                                name="areaName"
                                placeholder="Area Name"
                                className={handleClass("areaName")}
                                {...formik.getFieldProps("areaName")}
                                readOnly
                            />
                            {formik.touched.areaName && formik.errors.areaName && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.areaName}</p>
                            )}
                        </div>

                        {/* Hotel Phone Number */}
                        <div>
                            <label className="block text-[#1E1E1E] text-[17px] mb-2 font-medium">
                                Hotel Phone Number
                            </label>
                            <input
                                type="text"
                                name="hotelPhone"
                                placeholder="+91 97865 855775"
                                className={handleClass("hotelPhone")}
                                {...formik.getFieldProps("hotelPhone")}
                                readOnly
                            />
                            {formik.touched.hotelPhone && formik.errors.hotelPhone && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.hotelPhone}</p>
                            )}
                        </div>





                    </div>
                </div>

                {/* DOCUMENTS */}
                <h2 className="text-2xl font-semibold m-3 md:m-5 text-black mt-10 mb-4">Documents</h2>
                <div className="bg-white p-4 m-3 md:p-8 md:m-5 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* GST */}
                        <div>
                            <label className="block text-[#1E1E1E] text-[17px] mb-2 font-medium">
                                Enter GST Number
                            </label>
                            <input
                                type="text"
                                name="gstNumber"
                                placeholder="27ABCDE1234F1Z5"
                                className={handleClass("gstNumber")}
                                {...formik.getFieldProps("gstNumber")}
                                readOnly
                            />
                            {formik.touched.gstNumber && formik.errors.gstNumber && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.gstNumber}</p>
                            )}
                        </div>

                        {/* Shop License */}
                        <div>
                            <label className="block text-[#1E1E1E] text-[17px] mb-2 font-medium">
                                Enter Shop Act License Number
                            </label>
                            <input
                                type="text"
                                name="shopLicense"
                                placeholder="MH-MUM-SEA-2024-123456"
                                className={handleClass("shopLicense")}
                                {...formik.getFieldProps("shopLicense")}
                                readOnly
                            />
                            {formik.touched.shopLicense && formik.errors.shopLicense && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.shopLicense}</p>
                            )}
                        </div>

                        {/* Food License */}
                        <div>
                            <label className="block text-[#1E1E1E] text-[17px] mb-2 font-medium">
                                Enter Food & Drug License Number
                            </label>
                            <input
                                type="text"
                                name="foodLicense"
                                placeholder="9567475674"
                                className={handleClass("foodLicense")}
                                {...formik.getFieldProps("foodLicense")}
                                readOnly
                            />
                            {formik.touched.foodLicense && formik.errors.foodLicense && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.foodLicense}</p>
                            )}
                        </div>

                        {/* Clerk License */}
                        <div>
                            <label className="block text-[#1E1E1E] text-[17px] mb-2 font-medium">
                                Enter Clerk's License Number
                            </label>
                            <input
                                type="text"
                                name="clerkLicense"
                                placeholder="83465736388"
                                className={handleClass("clerkLicense")}
                                {...formik.getFieldProps("clerkLicense")}
                                readOnly
                            />
                            {formik.touched.clerkLicense && formik.errors.clerkLicense && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.clerkLicense}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* <button
                    type="submit"
                    className="bg-blue-500 ml-[45%] text-white px-8 py-3 rounded-md mt-5 hover:bg-blue-600 transition"
                >
                    Submit
                </button> */}
            </form>
        </div>
    </>
};

export default PersonalDetails;
