import React, { useEffect } from "react";
import { useGetToggleAvailabilityMutation } from "../../redux/apis/attendance";
import { useDispatch, useSelector } from "react-redux";

const AttendanceTimer = () => {
    const dispatch = useDispatch();
    const shopId = useSelector((state) => state.auth.shopId);
    const isActive = useSelector((state) => state.auth.isActive);
    const checkInTime = useSelector((state) => state.auth.checkInTime);



    const [toggleAvailability, { data, isLoading, error }] = useGetToggleAvailabilityMutation();
    useEffect(() => {
        if (shopId) {
            toggleAvailability({ ShopId: shopId }); // API call
        }
    }, [shopId]);

    if (isLoading) return <p className="text-black mt-36">Loading...</p>;
    if (error) return <p className="text-black mt-36">Error fetching data</p>;
    return <>
        <pre>{JSON.stringify(data, null, 2)}</pre>

        <div className="w-full min-h-screen mt-20 bg-white p-6 flex gap-6">
            {/* LEFT TABLE */}
            <div className=" bg-[#D9D9D92B] shadow text-black rounded-2xl p-6 w-[60%] h-[690px]">

                {/* HEADER ABOVE TABLE ROWS */}
                <div className=" bg-[#0073FF0F] rounded-full w-full mb-4">
                    <div className="grid grid-cols-4 p-3 ml-20 font-medium text-gray-700 text-left">
                        <span>Day</span>
                        <span className="ml-3">Check In</span>
                        <span className="ml-10">Check Out</span>
                        <span className="ml-15">Hours</span>
                    </div>
                </div>

                <table className="w-full ml-7">
                    <tbody>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <tr key={i} className="border-b border-[#D9D9D9]">
                                <td className="pl-3 text-[#797878]">17 Sept 2025</td>
                                <td className="pr-9 text-[#797878]">1:20 PM</td>
                                <td className="p-3 text-[#797878] pr-6">2:20 PM</td>
                                <td className="pr-9 text-[#797878]">1 h</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>


            {/* RIGHT SIDE */}
            <div className="flex flex-col  gap-6 w-[40%]">
                {/* Calendar */}
                <div className="bg-white rounded-2xl h-[67%] p-6 shadow-[0_4px_12px_rgba(0,0,0,0.15)]">

                    <h2 className="text-2xl font-semibold font-Poppins ml-6 text-[#333333] mb-10 mt-5">January</h2>
                    <div className="grid grid-cols-7 text-center text-gray-700 gap-y-4">

                        {/* DAYS HEADER */}
                        <div className="text-gray-400">m</div>
                        <div className="text-gray-400">t</div>
                        <div className="text-gray-400">w</div>
                        <div className="text-gray-400">t</div>
                        <div className="text-gray-400">f</div>
                        <div className="text-gray-400">s</div>
                        <div className="text-gray-400">s</div>

                        {/* DATES 1–31 */}
                        <div className="p-2 w-10 h-10 flex items-center justify-center rounded-full text-sm cursor-pointer ml-4 text-[#333333]">01</div>
                        <div className="p-2 w-10 h-10 flex items-center justify-center rounded-full text-sm cursor-pointer ml-4 text-[#333333] bg-[#FF8D28] text-white">02</div>
                        <div className="p-2 w-10 h-10 flex items-center justify-center rounded-full text-sm cursor-pointer ml-4 text-[#333333]">03</div>
                        <div className="p-2 w-10 h-10 flex items-center justify-center rounded-full text-sm cursor-pointer ml-4 text-[#333333]">04</div>
                        <div className="p-2 w-10 h-10 flex items-center justify-center rounded-full text-sm cursor-pointer ml-4 text-[#333333]">05</div>
                        <div className="p-2 w-10 h-10 flex items-center justify-center rounded-full text-sm cursor-pointer ml-4 text-[#333333]">06</div>
                        <div className="p-2 w-10 h-10 flex items-center justify-center rounded-full text-sm cursor-pointer ml-4 text-[#333333]">07</div>
                        <div className="p-2 w-10 h-10 flex items-center justify-center rounded-full text-sm cursor-pointer ml-4 text-[#333333]">08</div>
                        <div className="p-2 w-10 h-10 flex items-center justify-center rounded-full text-sm cursor-pointer ml-4 text-[#333333]">09</div>
                        <div className="p-2 w-10 h-10 flex items-center justify-center rounded-full text-sm cursor-pointer ml-4 text-[#333333]">10</div>

                        <div className="p-2 w-10 h-10 flex items-center justify-center rounded-full text-sm cursor-pointer ml-4 text-[#333333]">11</div>
                        <div className="p-2 w-10 h-10 flex items-center justify-center rounded-full text-sm cursor-pointer ml-4 text-[#333333]">12</div>
                        <div className="p-2 w-10 h-10 flex items-center justify-center rounded-full text-sm cursor-pointer ml-4 text-[#333333]">13</div>
                        <div className="p-2 w-10 h-10 flex items-center justify-center rounded-full text-sm cursor-pointer ml-4 text-[#333333]">14</div>
                        <div className="p-2 w-10 h-10 flex items-center justify-center rounded-full text-sm cursor-pointer ml-4 text-[#333333]">15</div>
                        <div className="p-2 w-10 h-10 flex items-center justify-center rounded-full text-sm cursor-pointer ml-4 text-[#333333]">16</div>
                        <div className="p-2 w-10 h-10 flex items-center justify-center rounded-full text-sm cursor-pointer ml-4 text-[#333333]">17</div>
                        <div className="p-2 w-10 h-10 flex items-center justify-center rounded-full text-sm cursor-pointer ml-4 text-[#333333]">18</div>
                        <div className="p-2 w-10 h-10 flex items-center justify-center rounded-full text-sm cursor-pointer ml-4 text-[#333333]">19</div>
                        <div className="p-2 w-10 h-10 flex items-center justify-center rounded-full text-sm cursor-pointer ml-4 text-[#333333]">20</div>

                        <div className="p-2 w-10 h-10 flex items-center justify-center rounded-full text-sm cursor-pointer ml-4 text-[#333333]">21</div>
                        <div className="p-2 w-10 h-10 flex items-center justify-center rounded-full text-sm cursor-pointer ml-4 text-[#333333]">22</div>
                        <div className="p-2 w-10 h-10 flex items-center justify-center rounded-full text-sm cursor-pointer ml-4 text-[#333333]">23</div>
                        <div className="p-2 w-10 h-10 flex items-center justify-center rounded-full text-sm cursor-pointer ml-4 text-[#333333]">24</div>
                        <div className="p-2 w-10 h-10 flex items-center justify-center rounded-full text-sm cursor-pointer ml-4 text-[#333333]">25</div>
                        <div className="p-2 w-10 h-10 flex items-center justify-center rounded-full text-sm cursor-pointer ml-4 text-[#333333]">26</div>
                        <div className="p-2 w-10 h-10 flex items-center justify-center rounded-full text-sm cursor-pointer ml-4 text-[#333333]">27</div>
                        <div className="p-2 w-10 h-10 flex items-center justify-center rounded-full text-sm cursor-pointer ml-4 text-[#333333]">28</div>
                        <div className="p-2 w-10 h-10 flex items-center justify-center rounded-full text-sm cursor-pointer ml-4 text-[#333333]">29</div>
                        <div className="p-2 w-10 h-10 flex items-center justify-center rounded-full text-sm cursor-pointer ml-4 text-[#333333]">30</div>

                        <div className="p-2 w-10 h-10 flex items-center justify-center rounded-full text-sm cursor-pointer ml-4">31</div>

                    </div>

                </div>

                {/* TIMER SECTION */}
                <div className="bg-white shadow rounded-2xl p-8 text-center shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
                    <h1 className="text-3xl tracking-widest text-black">00 : 01 : 00</h1>
                    <p className="mt-2 text-black dm-sans ">14 August 2025</p>
                </div>
            </div>
        </div>
    </>
};

export default AttendanceTimer;
