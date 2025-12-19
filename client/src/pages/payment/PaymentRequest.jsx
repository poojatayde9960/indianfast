import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBankRequestMutation, useGetShopBankRequestsQuery } from "../../redux/apis/bankRequestApi";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useGetProfileQuery } from "../../redux/apis/vendorApi";

const PaymentRequest = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [BankRequest] = useBankRequestMutation();
    const onSubmit = async (data) => {
        try {
            await BankRequest({
                shopId: shopId,
                amount: Number(data.amount),
                bankAccountOrUpiId: data.bankAccountNumber,
                accountHolderName: data.accountHolderName,
                ifscCode: data.ifscCode,
                remark: data.remark || "",
            }).unwrap();
            toast.success("Request Submitted Successfully!");
            setOpenPopup(false);

        } catch (err) {
            console.log(err);
            alert("Something went wrong!");
        }
    };

    const shopId = useSelector((state) => state.auth.shopId);
    const { data: profileData, isLoading } = useGetProfileQuery(shopId);

    const { data } = useGetShopBankRequestsQuery(shopId);

    const balance = profileData?.shop?.points ?? 0;


    const navigate = useNavigate();
    const [openPopup, setOpenPopup] = useState(false);

    const getStatusColor = (status) => {
        if (status === "completed") return "text-green-600";
        if (status === "pending") return "text-orange-500";
        if (status === "rejected") return "text-red-600";
        return "text-gray-600";
    };

    const formatDate = (isoDate) => {
        if (!isoDate) return "";
        const date = new Date(isoDate);
        return (
            date.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            }) +
            " " +
            date.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
            })
        );
    };
    if (isLoading) {
        return (
            // <div className="p-4 sm:p-5 md:p-6 bg-[#F5F5F5] mt-20 min-h-[calc(100vh-80px)] overflow-y-auto animate-pulse">
            <div className="p-4 sm:p-5 md:p-6 bg-[#F5F5F5] mt-20 min-h-[calc(100vh-80px)] transition-all duration-500">

                <div className="flex flex-col md:flex-row gap-4">

                    <div
                        className="rounded-2xl overflow-hidden shadow-lg p-5 flex-1"
                        style={{
                            background: "linear-gradient(180deg, #EF9C01 0%, #FF9129 100%)",
                        }}
                    >
                        <div className="h-4 w-32 bg-white/40 rounded"></div>

                        <div className="mt-4 h-10 w-40 bg-white/40 rounded"></div>

                        <div
                            className="mt-6 h-10 w-44 rounded-lg shadow-md bg-white/30"
                        ></div>
                    </div>

                    <div className="bg-white rounded-2xl p-5 flex-1 shadow">
                        <div className="h-4 w-28 bg-slate-200 rounded"></div>
                        <div className="mt-5 h-10 w-24 bg-slate-300 rounded"></div>
                    </div>
                </div>

                <div className="mt-10 bg-white shadow rounded-xl overflow-hidden">
                    <div className="border border-gray-300 rounded-xl p-4 md:p-6">

                        <div className="grid grid-cols-7 gap-4 mb-4">
                            {[...Array(7)].map((_, i) => (
                                <div key={i} className="h-4 bg-slate-200 rounded"></div>
                            ))}
                        </div>

                        <div className="space-y-3">
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className="grid grid-cols-7 gap-4 py-3 border-b border-gray-100"
                                >
                                    {[...Array(7)].map((_, j) => (
                                        <div
                                            key={j}
                                            className="h-4 bg-slate-100 rounded"
                                        ></div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* <pre className="text-black mt-20">{JSON.stringify(profileData, null, 2)}</pre> */}
            {openPopup && (
                <div className="fixed inset-0 mt-20 bg-opacity-40  flex items-center justify-center z-50 px-4">

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="bg-white w-full max-w-lg md:max-w-2xl rounded-xl p-6 shadow-xl"
                    >
                        <h2 className="text-xl font-bold mb-4 dm-sans text-black">Withdraw Request</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-gray-600">Account Holder Name</label>
                                <input
                                    className="w-full border border-gray-300 text-black p-2 rounded mt-1"
                                    {...register("accountHolderName", { required: true })}
                                />
                            </div>
                            <div>
                                <label className="text-gray-600">Amount</label>
                                <input
                                    type="number"
                                    className="w-full border border-gray-300 text-black p-2 rounded mt-1"
                                    {...register("amount", {
                                        required: "Amount is required",
                                        validate: (value) => {
                                            if (Number(value) <= 0) return "Amount must be greater than 0";
                                            if (Number(value) > balance)
                                                return "You cannot request more than your available balance";
                                            return true;
                                        },
                                    })}
                                />

                                {errors.amount && (
                                    <p className="text-red-600 text-sm mt-1">{errors.amount.message}</p>
                                )}

                                {/* <label className="text-gray-600">Amount</label>
                                <input
                                    type="number"
                                    className="w-full border border-gray-300 text-black p-2 rounded mt-1"
                                    {...register("amount", { required: true })}
                                /> */}
                            </div>



                            <div>
                                <label className="text-gray-600">Bank A/C or UPI ID</label>
                                <input
                                    className="w-full border border-gray-300 text-black p-2 rounded mt-1"
                                    {...register("bankAccountNumber", { required: true })}
                                />
                            </div>

                            <div>
                                <label className="text-gray-600">IFSC Code</label>
                                <input
                                    className="w-full border border-gray-300 text-black p-2 rounded mt-1"
                                    {...register("ifscCode", { required: true })}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="text-gray-600">Remark</label>
                                <input
                                    className="w-full border border-gray-300 text-black p-2 rounded mt-1"
                                    {...register("remark")}
                                />
                            </div>

                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setOpenPopup(false)}
                                type="button"
                                className="px-4 py-2 text-black border rounded"
                            >
                                Cancel
                            </button>
                            <button
                                className="px-5 py-2 rounded text-white bg-[#FF9F03]"
                            >
                                Submit Request
                            </button>
                        </div>
                    </form>
                </div>
            )}
            <div className="p-4 sm:p-5 md:p-6 bg-[#F5F5F5] mt-20 min-h-[calc(100vh-80px)] md:h-[calc(100vh-80px)] overflow-y-auto transition-all duration-500">

                <div className="flex flex-col md:flex-row gap-4 items-stretch">

                    {/* Left Card */}
                    <div
                        className="rounded-2xl overflow-hidden shadow-lg p-5 flex-1"
                        style={{
                            background: "linear-gradient(180deg, #EF9C01 0%, #FF9129 100%)",
                        }}
                    >
                        <p className="text-sm text-white opacity-90">Current Balance</p>

                        <h1 className="mt-2 text-3xl dm-sans sm:text-4xl font-extrabold text-white tracking-wide">
                            ₹{balance}
                        </h1>

                        <button
                            onClick={() => setOpenPopup(true)}
                            className="mt-4 px-4 py-2 w-full md:w-44 rounded-lg shadow-md text-white active:scale-95"
                            style={{
                                background: "linear-gradient(180deg,#E5C6A9 0%, #C99E7A 100%)",
                                fontWeight: 600,
                            }}
                        >
                            Withdraw
                        </button>
                    </div>

                    {/* Right Card */}
                    <div
                        className="bg-white  rounded-2xl dm-sans p-5 flex-1 flex flex-col justify-center shadow"
                    >
                        <div className="mb-12">
                            <p className="text-sm text-gray-400 dm-sans ">Total Requests</p>

                            <p className="mt-3 text-3xl font-semibold text-gray-800">
                                {data?.total ?? 0}
                            </p>
                        </div>
                    </div>
                </div>

                {/* TABLE */}
                <div className="mt-10 bg-white shadow rounded-xl overflow-hidden">

                    <div className="border border-gray-300 rounded-xl p-4 md:p-6">
                        <div className="overflow-auto" style={{ maxHeight: "420px" }}>
                            <table className="w-full min-w-[700px] text-left border-collapse">
                                <thead className="bg-gray-100 text-gray-700 font-dm-sans">
                                    <tr>
                                        <th className="p-3 bg-gray-100 sticky top-0 z-20">Account Holder</th>
                                        <th className="p-3 bg-gray-100 sticky top-0 z-20">Amount</th>
                                        <th className="p-3 bg-gray-100 sticky top-0 z-20">UPI / Account</th>
                                        <th className="p-3 bg-gray-100 sticky top-0 z-20">IFSC</th>
                                        <th className="p-3 bg-gray-100 sticky top-0 z-20">Remark</th>
                                        <th className="p-3 bg-gray-100 sticky top-0 z-20">Date & Time</th>
                                        <th className="p-3 bg-gray-100 sticky top-0 z-20">Status</th>
                                    </tr>
                                </thead>

                                {/* <tbody>
                                    {data?.data?.map((req, index) => (
                                        <tr key={index} className="border-t border-gray-100 text-gray-500">
                                            <td className="p-3 dm-sans">{req.bankDetails.accountHolderName}</td>
                                            <td className="p-3 dm-sans">₹{req.bankDetails.amount}</td>
                                            <td className="p-3 dm-sans">{req.bankDetails.bankAccountOrUpiId}</td>
                                            <td className="p-3 dm-sans">{req.bankDetails.ifscCode}</td>
                                            <td className="p-3 dm-sans">{req.bankDetails.remark}</td>
                                            <td className="p-3 dm-sans">{formatDate(req.createdAt)}</td>
                                            <td className={`p-3 dm-sans font-semibold ${getStatusColor(req.bankDetails.statusofpayment)}`}>
                                                {req.bankDetails.statusofpayment}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody> */}
                                <tbody>
                                    {data?.data?.length > 0 ? (
                                        data.data.map((req, index) => (
                                            <tr key={index} className="border-t border-gray-100 text-gray-500">
                                                <td className="p-3 dm-sans">
                                                    {req.bankDetails.accountHolderName}
                                                </td>
                                                <td className="p-3 dm-sans">₹{req.bankDetails.amount}</td>
                                                <td className="p-3 dm-sans">
                                                    {req.bankDetails.bankAccountOrUpiId}
                                                </td>
                                                <td className="p-3 dm-sans">{req.bankDetails.ifscCode}</td>
                                                <td className="p-3 dm-sans">{req.bankDetails.remark}</td>
                                                <td className="p-3 dm-sans">{formatDate(req.createdAt)}</td>
                                                <td
                                                    className={`p-3 dm-sans font-semibold ${getStatusColor(
                                                        req.bankDetails.statusofpayment
                                                    )}`}
                                                >
                                                    {req.bankDetails.statusofpayment}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="text-center py-10 text-gray-400 dm-sans"
                                            >
                                                No payment requests found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>

                            </table>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PaymentRequest;
