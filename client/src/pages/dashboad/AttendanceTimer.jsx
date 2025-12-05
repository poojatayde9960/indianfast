import React, { useEffect, useState } from "react";
import { useGetToggleAvailabilityMutation } from "../../redux/apis/attendance";
import { useSelector } from "react-redux";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";

const AttendanceTimer = () => {
    const shopId = useSelector((state) => state.auth.shopId);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [attendanceData, setAttendanceData] = useState(null);

    const [getToggleAvailability, { data, isLoading, error }] = useGetToggleAvailabilityMutation();

    const formatDateForAPI = (date) => format(date, "dd-MM-yyyy");

    useEffect(() => {
        if (shopId && selectedDate) {
            const formattedDate = formatDateForAPI(selectedDate);
            getToggleAvailability({
                ShopId: shopId,
                date: formattedDate,
            })
                .unwrap()
                .then((res) => {
                    console.log("Data for", formattedDate, ":", res);
                    setAttendanceData(res.deliverydetails);
                })
                .catch((err) => console.error("Error:", err));
        }
    }, [selectedDate, shopId, getToggleAvailability]);

    const today = new Date();
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const startDayOfWeek = monthStart.getDay(); // 0 = Sunday

    const formatTime = (isoString) => {
        if (!isoString) return "-";
        return format(new Date(isoString), "h:mm a");
    };

    const formatHours = (hours) => {
        if (!hours || hours === 0) return "0 h";
        const hrs = Math.floor(hours);
        const mins = Math.round((hours - hrs) * 60);
        return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
    };

    const sessions = attendanceData?.sessions || [];
    const totalHours = attendanceData?.totalWorkingHours || 0;

    if (isLoading) return <p className="text-black mt-36 text-center">Loading...</p>;
    const formatTotalHoursToTimer = (decimalHours) => {
        if (!decimalHours) return "00 : 00 : 00";

        const totalMinutes = Math.round(decimalHours * 100);

        const hrs = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
        const mins = String(totalMinutes % 60).padStart(2, "0");
        const secs = "00";

        return `${hrs} : ${mins} : ${secs}`;
    };




    return (
        <>
            <div className="p-4 sm:p-5 md:p-6 bg-[#F5F5F5] mt-20 min-h-[calc(100vh-80px)] 
                            flex flex-col lg:flex-row gap-6 
                            overflow-y-auto transition-all duration-500">

                <div className="bg-[#D9D9D92B] shadow text-black rounded-2xl p-4 sm:p-6 
                                w-full lg:w-[60%] h-fit lg:h-[600px] flex flex-col">

                    <div className="bg-[#0073FF0F] rounded-full w-full mb-4 px-4 sm:px-8 py-3">
                        <div className="grid grid-cols-3 dm-sans font-medium text-gray-700 text-sm sm:text-base">
                            <span className="text-left">Check In</span>
                            <span className="text-center">Check Out</span>
                            <span className="text-right">Hours</span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto scrollbar-hide -mr-4 pr-4 pb-4">
                        {error ? (
                            <div className="text-center text-red-600 py-10">
                                {error.error || error.data?.message || "Error fetching data"}
                            </div>
                        ) : sessions.length === 0 ? (
                            <div className="text-center text-gray-500 py-16 text-sm sm:text-base">
                                No sessions recorded for this date
                            </div>
                        ) : (
                            <div className="space-y-0">
                                {sessions.map((session, i) => (
                                    <div
                                        key={i}
                                        className="grid grid-cols-3 px-4 sm:px-8 py-4 hover:bg-gray-50 
                                                 border-b border-[#D9D9D9] last:border-b-0 text-sm sm:text-base"
                                    >
                                        <span className="text-[#797878] dm-sans font-medium">
                                            {formatTime(session.checkInTime)}
                                        </span>
                                        <span className="text-[#797878] dm-sans text-center">
                                            {session.checkOutTime ? formatTime(session.checkOutTime) : (
                                                <span className="text-green-600 font-medium">Active</span>
                                            )}
                                        </span>
                                        <span className="text-[#797878] dm-sans text-right font-medium">
                                            {formatHours(session.workingHours)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Total Hours */}
                    {/* {!error && sessions.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-300 text-right pr-4 sm:pr-8 
                                        text-lg font-semibold text-[#333] dm-sans">
                            Total: {(totalHours)}
                        </div>
                    )} */}
                </div>

                <div className="flex flex-col gap-6 w-full lg:w-[40%]">

                    {/* Calendar */}
                    <div className="bg-white rounded-2xl h-[96%] p-4 sm:p-6 shadow-lg flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <button
                                onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}
                                className="p-2 hover:bg-gray-100 rounded-full transition"
                            >
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            <h2 className="text-xl sm:text-2xl font-semibold font-Poppins text-[#333333]">
                                {format(selectedDate, "MMMM yyyy")}
                            </h2>

                            <button
                                onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}
                                className="p-2 hover:bg-gray-100 rounded-full transition"
                            >
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        <div className="grid grid-cols-7 gap-1 text-center text-gray-700">
                            {["M", "T", "W", "T", "F", "S", "S"].map((day) => (
                                <div key={day} className="text-gray-400 font-medium text-xs sm:text-sm py-2">
                                    {day}
                                </div>
                            ))}

                            {Array.from({ length: startDayOfWeek === 0 ? 6 : startDayOfWeek - 1 }).map((_, i) => (
                                <div key={`empty-${i}`} />
                            ))}

                            {monthDays.map((day) => {
                                const isToday = isSameDay(day, today);
                                const isSelected = isSameDay(day, selectedDate);

                                return (
                                    <div
                                        key={day.toISOString()}
                                        onClick={() => setSelectedDate(day)}
                                        className={`
                        w-8 h-8 sm:w-10 sm:h-10 mx-auto flex items-center justify-center 
                        rounded-full text-xs sm:text-sm cursor-pointer transition-all
                        ${isSelected ? "bg-[#FF8D28] text-white font-bold" : ""}
                        ${isToday && !isSelected ? "bg-blue-100 text-blue-700 font-bold" : ""}
                        ${!isSelected && !isToday ? "hover:bg-gray-100 text-[#333333]" : ""}
                    `}
                                    >
                                        {format(day, "d")}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Timer Card */}
                    <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 text-center">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl tracking-widest text-black font-mono">
                            {formatTotalHoursToTimer(totalHours)}
                        </h1>

                        <p className="mt-3 text-sm sm:text-base text-black dm-sans">
                            {format(selectedDate, "dd MMMM yyyy")}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AttendanceTimer;