import React from "react";

const Complaints = () => {
    return (
        // <div className="bg-[#F5F5F5] min-h-screen p-8 mt-16">
        <div className="p-4 sm:p-5 md:p-6 bg-[#F5F5F5] mt-20 min-h-[calc(100vh-80px)] md:h-[calc(100vh-80px)] overflow-y-auto transition-all duration-500">
            <div className="bg-white shadow-sm  border border-[#E5E5E5]">
                {/* Header */}
                <div className="grid grid-cols-3 bg-[#F3F3F3] px-6 py-4 border-b m-11 border-[#E5E5E5]">
                    <p className="text-[#000] font-medium">Customer Name</p>
                    <p className="text-[#000] font-medium ">Complaint</p>
                    <p className="text-[#000] font-medium ml-28">Date & Time</p>

                </div>

                {/* Row */}
                <div className="grid grid-cols-3 px-6 py-5 mr-7  ml-7 text-[#000] border-b -mt-7 border-[#D9D9D9]">
                    <div>
                        <p>John Doe</p>
                    </div>
                    <div className="w-[90%] leading-relaxed mr-60">
                        <p>
                            I recently placed an order through the app, but the experience was
                            not satisfactory. The food arrived 45 minutes late, and it was
                            cold when delivered. Also, one of the items I ordered was missing.
                        </p>
                    </div>
                    <div className="ml-28">
                        <p>12/08/2025</p>
                        <p>10:00 Am</p>
                    </div>
                </div>

                <div className="h-[400px]" />
            </div>
        </div>
    );
};

export default Complaints;
