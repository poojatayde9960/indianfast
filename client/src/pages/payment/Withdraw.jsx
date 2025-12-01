import React from "react";
import { useNavigate } from "react-router-dom";
import { useBankRequestMutation } from "../../redux/apis/bankRequestApi";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const Withdraw = () => {
    const shopId = useSelector((state) => state.auth.shopId);

    const [BankRequest] = useBankRequestMutation();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            await BankRequest({
                shopId: shopId,
                amount: Number(data.amount),
                bankAccountOrUpiId: data.bankAccountNumber,
                accountHolderName: data.accountHolderName,
                ifscCode: data.ifscCode,
                remark: data.remark,
            }).unwrap();
            toast.success("Request Submitted Successfully!");
            // alert("Request Submitted Successfully!");
            navigate("/paymentRequest");

        } catch (err) {
            console.log(err);
            alert("Something went wrong!");
        }
    };

    return (
        <div className="p-4 sm:p-5 md:p-6 mt-20 min-h-[calc(100vh-80px)] md:h-[calc(100vh-80px)] overflow-y-auto">

            {/* Header */}
            <div className="flex items-center text-black gap-3 mb-6">
                <span
                    className="text-2xl font-medium cursor-pointer"
                    onClick={() => navigate("/paymentRequest")}
                >
                    {"<"}
                </span>
                <h1 className="text-xl font-semibold">Bank Details</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>

                <label className="text-sm font-medium text-gray-700">
                    Account Holder Name
                </label>
                <input
                    type="text"
                    {...register("accountHolderName", { required: true })}
                    className="w-full mt-1 mb-1 p-3 text-black rounded-xl border border-gray-300 focus:outline-none"
                />
                {errors.accountHolderName && (
                    <p className="text-red-500 text-sm mb-3">Required</p>
                )}

                {/* Remark */}
                <label className="text-sm font-medium text-gray-700">
                    Remark
                </label>
                <input
                    type="text"
                    {...register("remark")}
                    className="w-full mt-1 mb-1 p-3 text-black rounded-xl border border-gray-300 focus:outline-none"
                />

                <label className="text-sm font-medium text-gray-700">
                    Bank Account Number
                </label>
                <input
                    type="text"
                    {...register("bankAccountNumber", { required: true })}
                    className="w-full mt-1 mb-1 p-3 rounded-xl text-black border border-gray-300 focus:outline-none"
                />
                {errors.bankAccountNumber && (
                    <p className="text-red-500 text-sm mb-3">Required</p>
                )}

                {/* IFSC Code */}
                <label className="text-sm font-medium text-gray-700">
                    IFSC Code
                </label>
                <input
                    type="text"
                    {...register("ifscCode", { required: true })}
                    className="w-full mt-1 mb-1 p-3 rounded-xl text-black border border-gray-300 focus:outline-none"
                />
                {errors.ifscCode && (
                    <p className="text-red-500 text-sm mb-3">Required</p>
                )}

                {/* Amount */}
                <label className="text-sm font-medium text-gray-700">
                    Amount
                </label>
                <input
                    type="number"
                    {...register("amount", { required: true })}
                    className="w-full mt-1 mb-1 p-3 rounded-xl text-black border border-gray-300 focus:outline-none"
                />
                {errors.amount && (
                    <p className="text-red-500 text-sm mb-3">Required</p>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full mt-5 p-3 rounded-xl bg-blue-600 text-white font-semibold"
                >
                    Submit Request
                </button>

            </form>
        </div>
    );
};

export default Withdraw;
