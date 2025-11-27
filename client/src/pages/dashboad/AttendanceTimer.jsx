// import React, { useEffect, useState } from "react";

// const AttendanceTimer = ({ attendance }) => {
//     const [duration, setDuration] = useState("00 : 00 : 00");
//     const [dateDisplay, setDateDisplay] = useState("");

//     useEffect(() => {
//         if (!attendance) return;

//         if (attendance.status === "Checked In") {
//             const checkIn = new Date(attendance.checkInTime);
//             setDateDisplay(checkIn.toLocaleDateString("en-GB")); // dd/mm/yyyy

//             const interval = setInterval(() => {
//                 const now = new Date();
//                 const diff = now - checkIn;
//                 const hrs = Math.floor(diff / (1000 * 60 * 60));
//                 const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
//                 const secs = Math.floor((diff % (1000 * 60)) / 1000);

//                 setDuration(
//                     `${hrs.toString().padStart(2, "0")} : ${mins
//                         .toString()
//                         .padStart(2, "0")} : ${secs.toString().padStart(2, "0")}`
//                 );
//             }, 1000);

//             return () => clearInterval(interval);
//         } else if (attendance.status === "Checked Out") {
//             setDuration(attendance.totalWorkingHours?.toFixed(2) + " hr");
//             setDateDisplay(attendance.checkOutTime);
//         }
//     }, [attendance]);

//     return (
//         <div className="bg-white w-[110%] rounded-xl ml-3 shadow p-6 flex flex-col items-center justify-center">
//             <h1 className="text-3xl font-bold dm-sans text-black">{duration}</h1>
//             <p className="text-gray-600 mt-2 dm-sans">{dateDisplay || "–"}</p>
//         </div>
//     );
// };

// export default AttendanceTimer;
