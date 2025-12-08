import React, { useEffect, useState } from "react";
import { useGetToggleAvailabilityMutation } from "../../redux/apis/attendance";
import { useSelector } from "react-redux";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from "date-fns";
import { Icon } from "@iconify/react";

const AttendanceTimer = () => {
    const shopId = useSelector((state) => state.auth.shopId);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [attendanceData, setAttendanceData] = useState(null);

    const [getToggleAvailability, { isLoading }] = useGetToggleAvailabilityMutation();

    useEffect(() => {
        if (!shopId || !selectedDate) return;

        const formattedDate = format(selectedDate, "dd-MM-yyyy");

        getToggleAvailability({
            ShopId: shopId,
            date: formattedDate
        })
            .unwrap()
            .then((res) => {
                if (res.success && res.deliverydetails) {
                    setAttendanceData({
                        sessions: res.deliverydetails.sessions || [],
                        totalWorkingHours: res.deliverydetails.totalWorkingHours || 0
                    });
                } else {
                    setAttendanceData({ sessions: [], totalWorkingHours: 0 });
                }
            })
            .catch((err) => {
                console.error("Error:", err);
                setAttendanceData({ sessions: [], totalWorkingHours: 0 });
            });
    }, [selectedDate, shopId, getToggleAvailability]);

    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const startDayOfWeek = monthStart.getDay();

    const formatTotalHoursToTimer = (totalHours) => {
        if (!totalHours || totalHours <= 0) return "00 : 00 : 00";
        const hrs = Math.floor(totalHours);
        const minsDecimal = (totalHours - hrs) * 60;
        const mins = Math.floor(minsDecimal);
        const secs = Math.round((minsDecimal - mins) * 60);
        return `${hrs.toString().padStart(2, "0")} : ${mins.toString().padStart(2, "0")} : ${secs.toString().padStart(2, "0")}`;
    };

    const handlePrevMonth = () => setSelectedDate(d => new Date(d.getFullYear(), d.getMonth() - 1));
    const handleNextMonth = () => setSelectedDate(d => new Date(d.getFullYear(), d.getMonth() + 1));

    return (
        // <div className="p-4 md:p-8 bg-[#F3F4F6] min-h-screen pt-28 flex justify-center items-start">
        <div className="p-4 sm:p-5 md:p-6 bg-[#F5F5F5] mt-20 min-h-[calc(100vh-80px)] md:h-[calc(100vh-80px)] overflow-y-auto transition-all duration-500">
            <div className="w-full max-w-5xl grid grid-cols-1 ml-16 md:grid-cols-2 mt-20 gap-8 items-stretch">

                {/* LEFT: Calendar (Clean White) */}
                <div className="bg-white rounded-[2rem]  p-8 shadow-xl flex flex-col justify-between h-full min-h-[450px]">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <button onClick={handlePrevMonth} className="h-10 w-10 flex items-center justify-center rounded-full border border-gray-100 hover:bg-gray-50 text-gray-600 transition-colors">
                            <Icon icon="lucide:chevron-left" width="20" />
                        </button>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight font-dm-sans">
                            {format(selectedDate, "MMMM yyyy")}
                        </h2>
                        <button onClick={handleNextMonth} className="h-10 w-10 flex items-center justify-center rounded-full border border-gray-100 hover:bg-gray-50 text-gray-600 transition-colors">
                            <Icon icon="lucide:chevron-right" width="20" />
                        </button>
                    </div>

                    {/* Days */}
                    <div className="flex-1 flex flex-col">
                        <div className="grid grid-cols-7 mb-4">
                            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                                <div key={day} className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    {day}
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-y-4 gap-x-2 flex-1 content-start">
                            {Array.from({ length: startDayOfWeek === 0 ? 6 : startDayOfWeek - 1 }).map((_, i) => (
                                <div key={`empty-${i}`} />
                            ))}
                            {monthDays.map((day) => {
                                const isSelected = isSameDay(day, selectedDate);
                                const isCurrentDate = isToday(day);
                                return (
                                    <button
                                        key={day.toISOString()}
                                        onClick={() => setSelectedDate(day)}
                                        className={`
                                            h-10 w-10 mx-auto flex flex-col items-center justify-center rounded-full text-sm font-medium transition-all duration-300 relative
                                            ${isSelected
                                                ? "bg-orange-400 text-white shadow-2xl scale-110"
                                                : isCurrentDate
                                                    ? "text-orange-500 font-bold"
                                                    : "text-gray-600 hover:bg-gray-50"
                                            }
                                        `}
                                    >
                                        {format(day, "d")}
                                        {isCurrentDate && !isSelected && (
                                            <span className="absolute bottom-1 h-1 w-1 bg-orange-500 rounded-full"></span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* RIGHT: Stats (Dark Premium) */}
                <div className="bg-[#1C1C1E] rounded-[2rem] p-10 shadow-2xl flex flex-col justify-center items-center text-center relative overflow-hidden min-h-[450px] text-white">

                    {/* Content */}
                    <div className="relative z-10 w-full flex flex-col items-center">
                        <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-sm border border-white/5">
                            <Icon icon="lucide:clock" width="32" className="text-orange-400" />
                        </div>

                        <p className="text-gray-400 text-sm font-medium uppercase tracking-[0.2em] mb-4">Total Duration</p>

                        <h1 className="text-6xl md:text-7xl font-sans font-light tracking-tighter text-white mb-2">
                            {formatTotalHoursToTimer(attendanceData?.totalWorkingHours)}
                        </h1>

                        <div className="mt-8 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 flex items-center gap-2">
                            <Icon icon="lucide:calendar" width="16" />
                            <span>{format(selectedDate, "dd MMMM yyyy")}</span>
                        </div>
                    </div>

                    {/* Gradient Effects */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>
                </div>

            </div>
        </div>
    );
};

export default AttendanceTimer;